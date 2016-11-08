/*jslint unparam: true, node: true */
'use strict';
const Validator = require('../util/Validator');

module.exports = function (xcatalog, ServerExceptions, ethContractService, ethTrxService, ethLockService, response, e, config) {

  const server = xcatalog('apiserver');
  
  /* 
   */
  server.post({ path: '/lock/status/', version: '1.0.0' }, function(req, res, next) {
    
    var _contract = req.body.contract;
    
    const validator = new Validator({ contract: _contract });

    validator.path('contract', ['string', 'required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {
      
      ethLockService.status(_contract, 0)
      .then(function (result) {
        return next(res.json({'status': result}));
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
  
  /* 
   */
  server.post({ path: '/lock/open/', version: '1.0.0' }, function(req, res, next) {
    
    var _contract = req.body.contract,
        _sender = req.body.sender;
    
    const validator = new Validator({ contract: _contract, sender: _sender });

    validator.path('contract', ['string', 'required']);
    validator.path('sender', ['number', 'required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {
      
      ethLockService.unlock(_contract, _sender)
      .then(function (result) {
        return next(res.json({'trxHash': result}));
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
  
  /* 
   */
  server.post({ path: '/lock/deploy/', version: '1.0.0' }, function(req, res, next) {
      
      var _contract = req.body.contract,
          _wait = req.body.wait;
    
    const validator = new Validator({ contract: _contract});

    validator.path('contract', ['string', 'required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {
      
      ethLockService.deploy(_contract,_wait)
      .then(function (result) {
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
