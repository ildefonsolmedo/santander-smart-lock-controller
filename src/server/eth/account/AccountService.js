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

/** @module account */
/** @custom xxx */
class AccountService {

  /**
   * Service that will handle acount lifecycle
   * @param {Object} "exceptions" - DI for exceptions
   * @constructor
   * @returns {Object} Returns a new AccountService service object.
   */
    constructor (catalog, moment, i18n, enume, exceptions, accountModel) {
        Exceptions = exceptions;
        xcatalog = catalog;
        moment = moment;
        this.i18n = i18n;
        this.model = transactionModel;
        this.enume = enume;
    }

    /**
     * Gets account details.
     * @memberOf EthAccService
     * @param {trxhash} trxhash Transaction identifier
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

module.exports = AccountService;
