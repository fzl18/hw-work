'use strict'; // eslint-disable-line 

const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;
const WebSocket = require('ws');
const parseURL = require('url').parse;
const Errors = require('./errors');
const ChainError = Errors.ChainError;
const DisconnectedError = Errors.DisconnectedError;
const NotConnectedError = Errors.NotConnectedError;
const TimeoutError = Errors.TimeoutError;
const ResponseFormatError = Errors.ResponseFormatError;
const ConnectionError = Errors.ConnectionError;

class ChainCore extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this.setMaxListeners(Infinity);
    this._url = url;
    this._trace = options.trace;
    if (this._trace) {
      this._console = console;
    }
    this._proxyURL = options.proxy;
    this._proxyAuthorization = options.proxyAuthorization;
    this._authorization = options.authorization;
    this._trustedCertificates = options.trustedCertificates;
    this._key = options.key;
    this._passphrase = options.passphrase;
    this._certificate = options.certificate;
    this._timeout = options.timeout || (20 * 1000);
    this._eventPrefix = options.eventPrefix || 'ws-';

    this._isReady = false;
    this._ws = null;
    this._nextRequestID = 1;
    this._retry = 0;
    this._retryTimer = null;
    this._onOpenErrorBound = null;
    this._onUnexpectedCloseBound = null;

    if (this._trace) {
      this._console.log('use websocket connection!');
    }
  }

  connect() {
    this._clearReconnectTimer();
    return new Promise((resolve, reject) => {
      if (!this._url) {
        reject(new ConnectionError('Cannot connect because no server was specified'));
      }
      if (this._getState() === WebSocket.OPEN) {//already connected , resolve it
        resolve();
      } else if (this._getState() === WebSocket.CONNECTING) {//is connecting, when connected resolve it
        this._ws.once('open', resolve);
      } else {
        // create new websocket connection
        this._ws = this._createWebSocket();
        // handle open error
        this._onOpenErrorBound = this._onOpenError.bind(this, reject);
        this._ws.once('error', this._onOpenErrorBound);
        this._onUnexpectedCloseBound = this._onUnexpectedClose.bind(this, true, resolve, reject);
        this._ws.once('close', this._onUnexpectedCloseBound);
        // add message listener
        this._ws.on('message', this._onMessage.bind(this));

        this._ws.once('open', () => {
          if (this._onOpenErrorBound) {
            this._ws.removeListener('error', this._onOpenErrorBound);
            this._onOpenErrorBound = null;
          }
          this._retry = 0;
          this._isReady = true;

          this._ws.on('error', error => {
            this.emit(this._eventPrefix + 'error', 'websocket', error.message, error);
          });
          this.emit(this._eventPrefix + 'connected');
          resolve();
        });
      }
    });
  }

  request(request, timeout) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new NotConnectedError('server not connected'));
        return;
      }

      let timer = null;
      const self = this;
      const id = this._nextRequestID;
      this._nextRequestID += 1;
      const eventName = this._eventPrefix + id.toString();

      function onDisconnect() {
        clearTimeout(timer);
        self.removeAllListeners(eventName);
        reject(new DisconnectedError());
      }

      function cleanup() {
        clearTimeout(timer);
        self.removeAllListeners(eventName);
        if (self._ws !== null) {
          self._ws.removeListener('close', onDisconnect);
        }
      }

      function _resolve(response) {
        cleanup();
        resolve(response);
      }

      function _reject(error) {
        cleanup();
        reject(error);
      }

      this.once(eventName, response => {
        if (response.status === 'error') {
          const resError = '[' + response.error + ']:' + response.error_message
          _reject(new ChainError(response.error_message, response.error));
        } else if (response.status === 'success') {
          _resolve(response.result);
        } else {
          _reject(new ResponseFormatError('unrecognized status: ' + response.status));
        }
      });

      this._ws.once('close', onDisconnect);

      // JSON.stringify automatically removes keys with value of 'undefined'
      const message = JSON.stringify(Object.assign({}, request, { id }));

      this._send(message).then(() => {
        const delay = timeout || this._timeout;
        timer = setTimeout(() => {
          _reject(new TimeoutError('message response timeout'))
        }, delay);
      });
    });
  }

  disconnect() {
    return this._disconnect(true);
  }

  reconnect() {
    return this.disconnect().then(() => this.connect());
  }

  isConnected() {
    if (!this._getShouldBeConnected()) {
      return false;
    } else if (!(this._getState() === WebSocket.OPEN && this._isReady)) {
      return false;
    } else {
      return true;
    }
  }

  _send(message) {
    if (this._trace) {
      this._console.log('send: ', message);
    }
    return new Promise((resolve, reject) => {
      this._ws.send(message, undefined, (error, result) => {
        if (error) {
          reject(new DisconnectedError(error.message));
        } else {
          resolve(result);
        }
      });
    });
  }

  _onMessage(message) {
    let parameters;
    if (this._trace) {
      // this._console.log('message: ', message);
    }
    try {
      const data = JSON.parse(message);
      if (data.type === 'response') {
        if (!(Number.isInteger(data.id) && data.id >= 0)) {
          throw new ResponseFormatError('valid id not found in response');
        }
        parameters = [this._eventPrefix + data.id.toString(), data];
      } else if (isStreamMessageType(data.type)) {
        parameters = [this._eventPrefix + data.type, data];
      } else if (data.type === undefined && data.error) {
        parameters = [this._eventPrefix + 'error', data.error, data.error_message, data];  // e.g. slowDown
      } else {
        throw new ResponseFormatError('unrecognized message type: ' + data.type);
      }
    } catch (error) {
      this.emit(this._eventPrefix + 'error', 'badMessage', error.message, message);
      return;
    }
    // we don't want this inside the try/catch or exceptions in listener
    // will be caught
    this.emit(...parameters);
  }

  getEventPrefix() {
    return this._eventPrefix;
  }

  _getState() {
    return this._ws ? this._ws.readyState : WebSocket.CLOSED;
  }

  _getShouldBeConnected() {
    return this._ws !== null;
  }

  _onUnexpectedClose(beforeOpen, resolve, reject, code) {
    if (this._onOpenErrorBound) {
      this._ws.removeListener('error', this._onOpenErrorBound);
      this._onOpenErrorBound = null;
    }
    // just in case
    this._ws.removeAllListeners('open');
    this._ws = null;
    this._isReady = false;
    if (beforeOpen) {
      // connection was closed before it was properly opened, so we must return
      // error to connect's caller
      this.connect().then(resolve, reject);
    } else {
      // if first parameter ws lib sends close code,
      // but sometimes it forgots about it, so default to 1006 - CLOSE_ABNORMAL
      this.emit(this._eventPrefix + 'disconnected', code || 1006);
      this._retryConnect();
    }
  }

  _retryConnect() {
    this._retry += 1;
    const retryTimeout = this._calculateTimeout(this._retry);
    this._retryTimer = setTimeout(() => {
      this.emit(this._eventPrefix + 'reconnecting', this._retry);
      this.connect().catch(this._retryConnect.bind(this));
    }, retryTimeout);
  }

  /**
   * First, for 2 seconds: 20 times per second
   * Then, for 1 minute: once per second
   *  Then, for 10 minutes: once every 10 seconds
   * Then: once every 30 seconds
   */
  _calculateTimeout(retriesCount) {
    return (retriesCount < 40) ? (1000 / 20) : (retriesCount < 40 + 60) ? (1000) : (retriesCount < 40 + 60 + 60) ? (10 * 1000) : (30 * 1000);
  }

  _clearReconnectTimer() {
    clearTimeout(this._retryTimer);
    this._retryTimer = null;
  }

  _onOpenError(reject, error) {
    this._onOpenErrorBound = null;
    if (this._onUnexpectedCloseBound) {
      this._ws.removeListener('close', this._onUnexpectedCloseBound);
    }
    this._onUnexpectedCloseBound = null;
    reject(new NotConnectedError(error && error.message));
  }

  _createWebSocket() {
    const options = {};
    if (this._proxyURL !== undefined) {
      const parsedURL = parseURL(this._url);
      const parsedProxyURL = parseURL(this._proxyURL);
      const proxyOverrides = _.omit({
        secureEndpoint: (parsedURL.protocol === 'wss:'),
        secureProxy: (parsedProxyURL.protocol === 'https:'),
        auth: this._proxyAuthorization,
        ca: this._trustedCertificates,
        key: this._key,
        passphrase: this._passphrase,
        cert: this._certificate
      }, _.isUndefined);
      const proxyOptions = _.assign({}, parsedProxyURL, proxyOverrides);
      let HttpsProxyAgent;
      try {
        HttpsProxyAgent = require('https-proxy-agent');
      } catch (error) {
        throw new Error('"proxy" option is not supported in the browser');
      }
      options.agent = new HttpsProxyAgent(proxyOptions);
    }
    if (this._authorization !== undefined) {
      const base64 = new Buffer(this._authorization).toString('base64');
      options.headers = { Authorization: `Basic ${base64}` };
    }
    const optionsOverrides = _.omit({
      ca: this._trustedCertificates,
      key: this._key,
      passphrase: this._passphrase,
      cert: this._certificate
    }, _.isUndefined);
    const websocketOptions = _.assign({}, options, optionsOverrides);
    const websocket = new WebSocket(this._url, null, websocketOptions);
    // we will have a listener for each outstanding request,
    // so we have to raise the limit (the default is 10)
    if (typeof websocket.setMaxListeners === 'function') {
      websocket.setMaxListeners(Infinity);
    }
    return websocket;
  }

  _disconnect(calledByUser) {
    if (calledByUser) {
      this._clearReconnectTimer();
      this._retry = 0;
    }
    return new Promise(resolve => {
      if (this._getState() === WebSocket.CLOSED) {
        resolve();
      } else if (this._getState() === WebSocket.CLOSING) {
        this._ws.once('close', resolve);
      } else {
        if (this._onUnexpectedCloseBound) {
          this._ws.removeListener('close', this._onUnexpectedCloseBound);
          this._onUnexpectedCloseBound = null;
        }
        this._ws.once('close', code => {
          this._ws = null;
          this._isReady = false;
          if (calledByUser) {
            this.emit(this._eventPrefix + 'disconnected', code || 1000); // 1000 - CLOSE_NORMAL
          }
          resolve();
        });
        this._ws.close();
      }
    });
  }
}

module.exports = ChainCore;
