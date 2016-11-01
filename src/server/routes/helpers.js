/*jslint node: true*/
"use strict";

var Exceptions = require("../services/ServiceExceptions"),
    fs = require("fs");

// function addAPIURL(req, collection, value) {
//     if (value && !value.url && value.id) {
//         value.url = req.baseUrl + "/" + collection + "/" + encodeURIComponent(value.id);
//     }
//     return value;
// }

module.exports = {
    jsonProxy: function (res) {
        return function (value) {
            if (!value) {
                res.status(204).end();
            } else {
                res.json(value);
            }
        };
    },

    sendCreated: function (res) {
        return function (value) {
            res.status(201);
            if (value.url) {
                res.location(value.url);
            }
            res.json(value);
        };
    },

    sendNoContent: function (res) {
        return function () {
            res.status(204).end();
        };
    },

    unlinkTemp: function (path) {
        return function () {
            fs.unlink(path);
        };
    }

};