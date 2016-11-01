/*jslint node: true, nomen: true*/
'use strict';

var chai = require('chai'),
    path = require('path'),
    expect = chai.expect,
    counter = 0;

function deepFreeze(o) {
    Object.freeze(o);
    if (Array.isArray(o)) {
        o.forEach(deepFreeze);
    } else if (o && typeof o === 'object') {
        Object.keys(o)
            .map((k) => o[k])
            .filter((v) => typeof v === 'object')
            .forEach(deepFreeze);
    }
    return o;
}


module.exports = {

    deepFreeze: deepFreeze,

    expectCount: function (model, count) {
        return function () {
            return expect(model.count()).eventually.equal(count);
        };
    },

    jsonClone: function (obj) {
        return JSON.parse(JSON.stringify(obj));
    },

    logValue: function (value) {
        console.dir(value, { depth: 5 });
        return value;
    },

    logReason: function (reason) {
        console.dir(reason, { depth: 5 });
        if (reason && reason.stack) {
            console.log(reason.stack);
        }
        throw reason;
    },
    increaseCounter: function () {
        counter += 1;
    },
    getCounter: function () {
        return counter;
    },
    resetCounter: function () {
        return 0;
    }
};
