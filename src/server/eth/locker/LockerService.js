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

/** @module contract */
/** @custom xxx */
class LockerService {

  /**
   * Service that will handle payments lifecycle
   * @param {Object} "exceptions" - DI for exceptions
   * @constructor
   * @returns {Object} Returns a new ContractService service object.
   */
    constructor (catalog, moment, i18n, enume, exceptions, contractModel) {
        Exceptions = exceptions;
        xcatalog = catalog;
        moment = moment;
        this.i18n = i18n;
        this.model = contractModel;
        this.enume = enume;
    }

    /**
     * Deploys a new contract in the Ethereum blockchain.
     * @memberOf EthContractService
     * @param {string} contract Contract name
     * @param {string} sender Address of the sender, if null it will use the default one
     * @param {boolean} wait If set to true it will wait until the contract is mined. If not it will return the transactionHash straight away and some other process will have to monitor the status.
     * @custom public 
     * @returns {string} Returns the transaction hash id of the contract deployment
     */
    status(contract,sender,wait) {

      let itself = this;
      return new Promise(function (resolve, reject) {
        
        // var validator = new Validator({ contract : contract,  wait: wait});
        
        // validator.path('contract', ['string', 'required']);
        // validator.path('wait', ['boolean', 'required']);

        // if (validator.hasErrors()) {
        //   let vErrors = validator.getErrors();
        //   reject(new Exceptions.Validation(vErrors) );
        //   return;
        // } else {
          console.log('entramos service');
          return itself.model.status()
              .then(function(response){
                
                console.log('back from model');
                resolve(response);
              },function(err){
                reject(err);
              })
              .catch(function(err){
                reject(err);
              });

        //}
      });

    }

}

module.exports = LockerService;
