'use strict'; // eslint-disable-line 

const _ = require('lodash');
const EventEmitter = require('events').EventEmitter;
const rpcReq = require('request');
const Errors = require('./errors');
const ChainError = Errors.ChainError;
const NotConnectedError = Errors.NotConnectedError;
const ConnectionError = Errors.ConnectionError;
const ResponseFormatError = Errors.ResponseFormatError;
const constant = require('./constants')

class ChainCore extends EventEmitter {
  constructor(url, options = {}) {
    super();
    this._url = url;
    this._trace = options.trace;
    if (this._trace) {
      this._console = console;
    }
    this._timeout = (options.timeout || constant.BaseTimeOut) * 1000;
    this._eventPrefix = options.eventPrefix || 'rpc-';
    if (this._trace) {
      this._console.log('use rpc connection!');
    }
  }

  connect() {
    return new Promise((resolve, reject) => {
      if (!this._url) {
        reject(new ConnectionError('Cannot connect because no server was specified'));
      }
      resolve();
    });
  }

  request(request, timeout) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected()) {
        reject(new NotConnectedError('server not connected'));
        return;
      }
      const requestTimeout = timeout || this._timeout;
      const url = this._url;
      const rpcRequest = {};
      rpcRequest.method = request.command;
      rpcRequest.params = [];
      rpcRequest.params.push(request ? request : {});

      rpcReq({
        url: url,
        timeout: requestTimeout,
        method: "POST",
        json: true,
        headers: {
          "content-type": "application/json",
        },
        body: rpcRequest
      }, function (error, response, body) {
        if (error) {
          reject(new ChainError("rpcError-" + error));
        } else if (response.statusCode != 200) {
          reject(new ChainError("rpcError-" + response.statusCode));
        } else {
          const result = body.result;
          if (result.status === 'error') {
            reject(new ChainError(JSON.stringify(result)));
          } else if (result.status === 'success') {
            resolve(result);
          } else {
            reject(new ResponseFormatError('unrecognized status: ' + JSON.stringify(result)));
          }
        }
      });

    });
  }

  disconnect() {
    return Promise.resolve();
  }

  reconnect() {
    Promise.resolve()
  }

  isConnected() {
    return true;
  }

  getEventPrefix() {
    return this._eventPrefix;
  }

}

module.exports = ChainCore;
