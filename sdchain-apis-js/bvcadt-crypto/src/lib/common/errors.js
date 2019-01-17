'use strict';
const util = require('util');

function extendableBuiltin(cls) {
  function ExtendableBuiltin() {
    cls.apply(this, arguments);
  }
  ExtendableBuiltin.prototype = Object.create(cls.prototype);
  return ExtendableBuiltin;
}

class APIError extends extendableBuiltin(Error) {
  constructor(message, type) {
    super(message);

    this.name = this.constructor.name;
    this.type = type||this.constructor.name;
    this.message = message;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor.name);
    }
  }

  toString() {
    let result = '[' + this.name + '(' + this.message;
    if (this.data) {
      result += ', ' + util.inspect(this.data);
    }
    result += ')]';
    return result;
  }

  /* console.log in node uses util.inspect on object, and util.inspect allows
  us to cutomize its output:
  https://nodejs.org/api/util.html#util_custom_inspect_function_on_objects */
  inspect() {
    return this.toString();
  }
}

class ChainError extends APIError { }

class UnexpectedError extends APIError { }

class LedgerVersionError extends APIError { }

class ConnectionError extends APIError { }

class NotConnectedError extends ConnectionError { }

class DisconnectedError extends ConnectionError { }

class TimeoutError extends ConnectionError { }

class ResponseFormatError extends ConnectionError { }

class ValidationError extends APIError { }

class SignError extends APIError { }

class NotFoundError extends APIError {
  constructor(message) {
    super(message || 'Not found');
  }
}

class MissingLedgerHistoryError extends APIError {
  constructor(message) {
    super(message || 'Server is missing ledger history in the specified range');
  }
}

class PendingLedgerVersionError extends APIError {
  constructor(message) {
    super(message || 'maxLedgerVersion is greater than server\'s'
      + ' most recent validated ledger');
  }
}

module.exports = {
  APIError,
  UnexpectedError,
  ConnectionError,
  ChainError,
  NotConnectedError,
  DisconnectedError,
  TimeoutError,
  ResponseFormatError,
  ValidationError,
  NotFoundError,
  PendingLedgerVersionError,
  MissingLedgerHistoryError,
  LedgerVersionError,
  SignError
};
