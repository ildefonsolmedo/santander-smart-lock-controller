/*jslint node: true*/
/** @namespace eth */
/** @custom xxx */

'use strict';

var
    Exceptions,
    xcatalog,
    moment,
    xreq = require('xreq'),
    Validator = xreq.utils('Validator');

/** @module transaction */
/** @custom xxx */
class TransactionService {

  /**
   * Service that will handle payments lifecycle
   * @param {Object} "exceptions" - DI for exceptions
   * @constructor
   * @returns {Object} Returns a new TransactionService service object.
   */
    constructor (catalog, moment, i18n, enume, exceptions, transactionModel) {
        Exceptions = exceptions;
        xcatalog = catalog;
        moment = moment;
        this.i18n = i18n;
        this.model = transactionModel;
        this.enume = enume;
    }

    /**
     * Checks whether the Ethereum node is up and running or not.
     * @memberOf EthTrxService
     * @param {string} name Contract name. For example. 'MyCoin'.
     * @custom public 
     */
    get(trxhash) {
      let itself = this;
      return new Promise(function (resolve, reject) {
        return itself.model.get(trxhash)
          .then(function(response){
            if (response) {
              resolve(response);
            } else {
              reject('Transaction not found');
            }
          },function(err){
            reject(err);
          })
          .catch(function(err){
            reject(err);
          });
      });

    }

}

module.exports = TransactionService;
