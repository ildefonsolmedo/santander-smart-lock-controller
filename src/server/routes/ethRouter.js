/*jslint unparam: true, node: true */
'use strict';
const Validator = require('../util/Validator');

module.exports = function (xcatalog, ServerExceptions, ethContractService, ethTrxService, ethLockService, response, e) {

  const server = xcatalog('apiserver');

  /* 
   */
  server.post({ path: '/lock/status/', version: '1.0.0' }, function(req, res, next) {
    
    // var _wait = req.body.wait,
    // _contract = req.body.contract,
    // _method = req.body.method,
    // _data = req.body.data,
    // _local = req.body.local,
    // _from = req.body.from;
    
    //web3.sha3("multiply(uint256)").substring(0, 8)

    //const validator = new Validator({ from: _from, wait : _wait,  contract: _contract, method: _method, data: _data, local: _local });

    // validator.path('contract', ['string', 'required']);
    // validator.path('method', ['string', 'required']);
    // validator.path('data', ['required']);
    // validator.path('wait', ['boolean','required']);
    // validator.path('local', ['boolean','required']);

    // if (validator.hasErrors()) {
    //     return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    // } else {
      
      ethLockService.status()
      .then(function (result) {
        
        //TODO set API response codes 
        return next(res.json({'status': result}));
      
      })
      .catch(function (error) {
        if(error instanceof Error){
          return next( ServerExceptions.createException(error, req) );
        } else {
          return next( ServerExceptions.createServerErrorException(error, req));
        }
      });

    //}


  });

  /* Get Transactions details */
  server.get({ path: '/trx', version: '1.0.0' }, function(req, res, next) {

    let _trxhash = req.query.trxhash;

    const validator = new Validator({ trxhash : _trxhash });

    validator.path('trxhash', ['string', 'required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {

      ethTrxService.get(
        _trxhash
      )
      .then(function (result) {
        //TODO set API response codes var _response = new response(e.ip.response.success,e.http.status.ok,result,l.__('IP00000'));
        return next(res.json(result));
      
      })
      .catch(function (error) {
        if(error instanceof Error){
          return next( ServerExceptions.createException(error, req) );
        } else {
          return next( ServerExceptions.createServerErrorException(error, req));
        }
      });

    }


  });

  

};
