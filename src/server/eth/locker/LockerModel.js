/*jslint node: true*/
/*globals Promise: true*/
/** @namespace eth */
/** @custom xxx */

'use strict';

var xreq = require('xreq'),
    helpers = xreq.helpers('modelHelpers'),
    ObjectID = require('mongodb').ObjectID;

/** @module contract */
/** @custom xxx */
class LockerModel {

    /**
     * Model to handle the contracts collection
     * @param {Object} "db" - DI for database
     * @param {Object} "i18n" - DI for i18n
     * @param {Object} "enume" - DI for enum
     * @param {Object} "moment" - DI for moment
     * @param {Object} "config" - DI for config
     * @param {Object} "ethHelper" - DI for ethHelper
     * @constructor
     * @returns {Object} Returns a new ContractModel object.
     */
    constructor (i18n, enume, moment, config, ethHelper) {
      //this.collection = db.collection("contracts");
      this.i18n       = i18n;
      this.contract   = {};
      this.enum       = enume;
      this.moment     = moment;
      this.config     = config;
      this.ethHelper  = ethHelper;
    }

    /**
     * Returns .
     * @public
     * @memberOf LockerModel
     * @param {string} contract Contract name
     * @param {string} sender Address of the sender, if null it will use the default one
     * @param {boolean} wait If set to true it will wait until the contract is mined. If not it will return the transactionHash straight away and some other process will have to monitor the status.
     * @custom public
     * @returns {Promise} Returns a new promise with the contract detail.
     */
    status (contract,sender,wait) {

        let compiled, abi;
        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            //ethHelp.util.status().then(function(result){
 
                //ethHelp.account.default(sender);

                // ethHelp.contract.get(contract + '.sol')
                // .then(function (result) {
                //     return ethHelp.util.compile(result);
                // })
                // .then(function (result) {
                //     // create contract
                //     return (Math.random() >= 0.5);
                // })
                // .then(function (result) {
                //     resolve(result);
                // })
                // .catch(function (error) {
                //     reject(error);
                // });
                
                //return (Math.random() >= 0.5);

            // }).catch(function (error) {
            //     reject(error);
            // });
            
            console.log('return');
            
            resolve(Math.random() >= 0.5);

        });

    }

}

module.exports = LockerModel;
