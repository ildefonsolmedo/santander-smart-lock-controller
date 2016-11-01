/*jslint node: true*/

"use strict";

var Exceptions = require("./ServiceExceptions"),
    UID_RE = /^[a-f0-9]{24}$/;

module.exports = {

    checkUId: function (id) {
        if (!UID_RE.test(id)) {
            throw new Exceptions.Validation("Wrong ID format");
        }
    },

    throwNotFoundOnNull: function (collection, resource, message) {
        return function (value) {
            if (value === null) {
                throw new Exceptions.NotFound(collection, resource, message);
            }
            return value;
        };
    },

    throwInternalOnNull: function (message) {
        return function (value) {
            if (value === null) {
                throw new Exceptions.Internal(message);
            }
            return value;
        };
    },

    throwAccessDenyOnNull: function (message) {
        return function (value) {
            if (value === null) {
                throw new Exceptions.AccessDenied(message);
            }
            return value;
        };
    },

    throwValidationOnDupKey: function (reason) {
        if (reason && ((reason.name === "MongoError" && reason.code === 11000) ||
            reason.name === "DuplicateKeyException")) {
            throw new Exceptions.Validation("Duplicated key");
        }
        throw reason;
    },

    copyProps: function (source, dest, props) {
        var total = 0;
        props.forEach(function (prop) {
            if (source[prop] !== undefined) {
                total += 1;
                dest[prop] = source[prop];
            }
        });
        return total;
    },

    filterDuplicates: function (a) {
        //filter duplicates keeping the array order (not efficient for large arrays)
        return a.filter(function (item, index, seft) {
            return seft.indexOf(item) === index;
        });
    }
};