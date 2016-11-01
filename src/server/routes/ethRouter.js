/*jslint unparam: true, node: true */
'use strict';
const Validator = require('../util/Validator');

module.exports = function (xcatalog, ServerExceptions, ethContractService, ethTrxService, response, e) {

  const server = xcatalog('apiserver');

  /* POST Send payment
   * Sends a new payment to payment service
   * @public
   * @memberOf PaymentRouter
   * @param paymentId
   * @param currency
   * @example <caption>I/O get payment (note: user as HTTP header)</caption>
   *    INPUT:
   *            /api/v1/payment/
   *            {
                      'currencyFrom': 'GBP',
                      'paymentId': '3B959EC078A763090A75E04072F8C6D469E02711A80282742680464AA2EC5958',
                      'amount': 350
                  }
   *
   *    OUTPUT - OK :

         {
              'code': 200,
              'type': 'OK',
              'body':    {
               '_id': '56a60a13800a87587a023755',
               'payment_id': 'E566318118954053788FE0354349CD8A07245343DDA22155E32616C2FB97E93E',
               'status': 'in_progress',
               'source_currency': 'GBP',
               'destination_currency': 'USD',
               'source_amount': '350',
               'destination_amount': '700',
               'exchange_rate': '2',
               'sending_fee': 0,
               'receiving_fee': 0,
               'user': '56a0c62f87de1a4c47475672',
               'recipient': '56a60a12800a87587a023754',
               'createdAt': '2016-01-25T11:42:11+00:00',
               'updatedAt': '2016-01-25T11:42:11+00:00'
              }
      }
   */
	server.post({ path: '/contract/', version: '1.0.0' }, function(req, res, next) {

    var _user = req.headers.user,
    _wait = req.body.wait,
    _contract = req.body.contract;

    const validator = new Validator({ wait : _wait,  contract: _contract });

    validator.path('contract', ['string', 'required']);
    validator.path('wait', ['boolean','required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {
      ethContractService.deployContract(
        _contract,
        null,
        _wait
      )
      .then(function (result) {
        //TODO set API response codes 
        return next(res.json({'trxhash': result}));
      
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

  /* POST Send payment
   * Sends a new payment to payment service
   * @public
   * @memberOf PaymentRouter
   * @param paymentId
   * @param currency
   * @example <caption>I/O get payment (note: user as HTTP header)</caption>
   *    INPUT:
   *            /api/v1/payment/
   *            {
                      'currencyFrom': 'GBP',
                      'paymentId': '3B959EC078A763090A75E04072F8C6D469E02711A80282742680464AA2EC5958',
                      'amount': 350
                  }
   *
   *    OUTPUT - OK :

         {
              'code': 200,
              'type': 'OK',
              'body':    {
               '_id': '56a60a13800a87587a023755',
               'payment_id': 'E566318118954053788FE0354349CD8A07245343DDA22155E32616C2FB97E93E',
               'status': 'in_progress',
               'source_currency': 'GBP',
               'destination_currency': 'USD',
               'source_amount': '350',
               'destination_amount': '700',
               'exchange_rate': '2',
               'sending_fee': 0,
               'receiving_fee': 0,
               'user': '56a0c62f87de1a4c47475672',
               'recipient': '56a60a12800a87587a023754',
               'createdAt': '2016-01-25T11:42:11+00:00',
               'updatedAt': '2016-01-25T11:42:11+00:00'
              }
      }
   */
  server.post({ path: '/contract/call/', version: '1.0.0' }, function(req, res, next) {

    var _wait = req.body.wait,
    _contract = req.body.contract,
    _method = req.body.method,
    _data = req.body.data,
    _local = req.body.local,
    _from = req.body.from;

    const validator = new Validator({ from: _from, wait : _wait,  contract: _contract, method: _method, data: _data, local: _local });

    validator.path('contract', ['string', 'required']);
    validator.path('method', ['string', 'required']);
    validator.path('data', ['required']);
    validator.path('wait', ['boolean','required']);
    validator.path('local', ['boolean','required']);

    if (validator.hasErrors()) {
        return next( ServerExceptions.createValidationException(validator.getErrors(), req) );
    } else {
      ethContractService.contractCall(
        _contract,
        _from,
        _data,
        _wait,
        _local,
        _method
      )
      .then(function (result) {
        //TODO set API response codes 
        return next(res.json({'trxhash': result}));
      
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

  /* GET Send payment
   * Sends a new payment to payment service
   * @public
   * @memberOf PaymentRouter
   * @param paymentId
   * @param currency
   * @example <caption>I/O get payment (note: user as HTTP header)</caption>
   *    INPUT:
   *            /api/v1/payment/
   *            {
                      'currencyFrom': 'GBP',
                      'paymentId': '3B959EC078A763090A75E04072F8C6D469E02711A80282742680464AA2EC5958',
                      'amount': 350
                  }
   *
   *    OUTPUT - OK :

         {
              'code': 200,
              'type': 'OK',
              'body':    {
               '_id': '56a60a13800a87587a023755',
               'payment_id': 'E566318118954053788FE0354349CD8A07245343DDA22155E32616C2FB97E93E',
               'status': 'in_progress',
               'source_currency': 'GBP',
               'destination_currency': 'USD',
               'source_amount': '350',
               'destination_amount': '700',
               'exchange_rate': '2',
               'sending_fee': 0,
               'receiving_fee': 0,
               'user': '56a0c62f87de1a4c47475672',
               'recipient': '56a60a12800a87587a023754',
               'createdAt': '2016-01-25T11:42:11+00:00',
               'updatedAt': '2016-01-25T11:42:11+00:00'
              }
      }
   */
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
