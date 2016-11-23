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
    status (contract, sender) {

        let compiled, abi;
        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            return ethHelp.util.status().then(function(result){

                ethHelp.account.default(sender);

                var mSig = ethHelp.util.sig('getStatus()'),
                    mVal = '0000000000000000000000000000000000000000000000000000000000000000',
                    code = '0x' + mSig + mVal;

                ethHelp.trx.call(ethHelp.account.get(sender), contract, code)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (error) {
                    reject(error);
                });

            }).catch(function (error) {
                reject(error);
            });

        });

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
    unlock (contract, sender) {

        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            return ethHelp.util.status().then(function(result){

                ethHelp.account.default(sender);

                var mSig = ethHelp.util.sig('unlock()'),
                    mVal = '0000000000000000000000000000000000000000000000000000000000000000',
                    code = mSig + mVal;

                ethHelp.trx.send(ethHelp.account.get(sender), contract, code)
                .then(function (result) {
                    resolve(result);
                })
                .catch(function (error) {
                    reject(error);
                });

            }).catch(function (error) {
                reject(error);
            });

        });

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
    deploy (name,waitUntilMined) {
        var compiled,
            abi,
            ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            ethHelp.util.getContractOrAbi(name)
            .then(function (result) {
                return ethHelp.util.compile(result);
            })
            .then(function (result) {
                compiled = result;
                abi = compiled.info.abiDefinition;
                //console.log('abi',abi);
                return ethHelp.util.saveAbi(name,abi);
            })
            .then(function (result) {
                var code = compiled.code;
                // create contract
                return ethHelp.contract.new(name,code,abi,10,waitUntilMined);

            })
            .then(function (result) {

                resolve(result);

            })
            .catch(function (error) {
                reject(error);
            });

        });

}


}

module.exports = LockerModel;
