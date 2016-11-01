/*jslint node: true*/
'use strict';
var config = require('config'),
    chai = require('chai'),
    server = require('xreq').server;

console.log('Environment: ' + process.env.NODE_ENV);
console.log('Configuration environment: ' + config.util.getEnv('NODE_ENV'));
console.log('Configuration instance: ' + config.util.getEnv('NODE_APP_INSTANCE'));

server('catalog-config')(require('xcatalog'), true);
chai.use(require('chai-as-promised'));
global.expect = chai.expect;
