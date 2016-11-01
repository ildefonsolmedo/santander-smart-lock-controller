/*jslint node: true*/
"use strict";

class ServiceException extends Error {
    constructor (message) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        if (message) {
            this.message = message;
        }
    }
}

class NotFoundException extends ServiceException{
    constructor (collection, resource, message) {
        super(message);
        this.collection = collection;
        this.resource = resource;
    }
}

class AccessDeniedException extends ServiceException {
    constructor (message) {
        super(message);
    }
}

class ValidationException extends ServiceException {
    constructor (errors, message) {
        super(message);
        this.errors = errors;
    }
}

class InternalException extends ServiceException {
    constructor (message) {
        super(message);
    }
}

module.exports = {
    Base: ServiceException,
    AccessDenied: AccessDeniedException,
    NotFound: NotFoundException,
    Validation: ValidationException,
    Internal: InternalException
};