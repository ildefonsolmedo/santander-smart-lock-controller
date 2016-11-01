/*jslint node: true*/
'use strict';
var inherits = require('util').inherits;

function error(obj, message) {
    Error.call(obj, message);
    Error.captureStackTrace(obj, obj.constructor);
    obj.name = obj.constructor.name;
    if (message) {
        obj.message = message;
    }
}

function EthException(message) {
    error(this, message);
}

inherits(EthException, Error);

function StatusException(message) {
    error(this, message);
}

inherits(StatusException, Error);

module.exports = {
    Base: EthException,
    Status: StatusException
};
