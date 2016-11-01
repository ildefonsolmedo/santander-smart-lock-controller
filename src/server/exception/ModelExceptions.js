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

function ModelException(message) {
    error(this, message);
}

inherits(ModelException, Error);

function DuplicateKeyException(message) {
    ModelException.call(this, message);
}

inherits(DuplicateKeyException, ModelException);

function InternalException(message) {
    ModelException.call(this, message);
}

inherits(InternalException, ModelException);

module.exports = {
    Base: ModelException,
    DuplicateKey: DuplicateKeyException,
    Internal: InternalException
};
