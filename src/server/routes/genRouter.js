/*jslint unparam: true, node: true */
'use strict';
const Validator = require('../util/Validator');

module.exports = function (xcatalog, ServerExceptions, ethContractService, ethTrxService) {

  const server = xcatalog('apiserver');

  /* GET Heartbeat
   * Checks the the app is up an running and returns the version
   * @public
   * @memberOf genRouter
   * @example <caption>I/O heartbeat</caption>
   *    INPUT:
   *            /
   *
   *    OUTPUT - OK :

         {
          "status": "success",
          "body": {
            "name": "EthInt",
            "version": "0.0.2",
            "date": "2016-02-09T20:54:43.997Z"
          },
          "code": 200
        }
   */
  server.get({ path: '/'}, function(req, res, next) {

    const result = {
      version: require('../package.json').version
    };

    return next(res.json(result));

  });

  

};
