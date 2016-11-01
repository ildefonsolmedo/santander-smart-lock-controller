/*jslint unparam: true, node: true */
/*globals Promise: true*/
'use strict';
var config = require('config'),
    fs = require('fs'), //TODO REVIEW
    catalog = require('xcatalog');


console.log('Configuration environment: ' + config.util.getEnv('NODE_ENV'));
console.log('Configuration instance: ' + config.util.getEnv('NODE_APP_INSTANCE'));

//Load catalog config - DI
require('./catalog-config')(catalog);

//When DI module is ready, start the server/s
catalog.ready().then(function (catalog) {

  // DI for serverSetup service
  var serverSetup = catalog('serverSetup');

  //Create API server
  var oServerConfig =  config.server;
      oServerConfig.routers = config.routers;
      oServerConfig.log = config.log;
  var server = serverSetup.createAPIServer(oServerConfig);

}).catch(function (reason) {
    console.error(reason);
});
