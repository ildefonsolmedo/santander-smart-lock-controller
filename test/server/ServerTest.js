/*jslint node: true*/
/*globals expect: true, Promise: true, describe: true, it: true, before: true */
'use strict';

var
    xcatalog = require('xcatalog'),
    unirest  = require('unirest');

describe('Server setup service', function () {

    var
        service,
        config,
        oServerConfig,
        server,
        client;

    before(function () {
        return xcatalog.ready().then(function () {
            
            service = xcatalog('serverSetup');
            config = xcatalog('config');
            oServerConfig =  config.server;
            oServerConfig.routers = config.routers;
            oServerConfig.log = config.log;
            server = service.createAPIServer(oServerConfig);

        });
    });


    //Extended timeout for slow services
    this.timeout(5000);


    describe('ServerSetup.prototype.createAPIServer(config)', function () {

        it('should return 200', function (done) {
          unirest
            .get('http://127.0.0.1:' + config.server.port)
            .end(function (response) {
              expect(response.statusCode).to.equal(200);
              done();
            });
        })

    });


    after(function () {
      server.close();
    });
});
