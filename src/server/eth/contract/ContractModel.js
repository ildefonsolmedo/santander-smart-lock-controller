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
class ContractModel {

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
     * Deploys a new contract in the Ethereum blockchain.
     * @public
     * @memberOf ContractModel
     * @param {string} contract Contract name
     * @param {string} sender Address of the sender, if null it will use the default one
     * @param {boolean} wait If set to true it will wait until the contract is mined. If not it will return the transactionHash straight away and some other process will have to monitor the status.
     * @custom public
     * @returns {Promise} Returns a new promise with the contract detail.
     */
    deployContract (contract,sender,wait) {

        let compiled, abi;
        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            ethHelp.util.status().then(function(result){
 
                //ethHelp.account.default(sender);

                ethHelp.contract.get(contract + '.sol')
                .then(function (result) {
                    return ethHelp.util.compile(result);
                })
                .then(function (result) {
                    compiled = helpers.json.getFirst(result);
                    abi = compiled.info.abiDefinition;
                    // Check
                    ethHelp.contract.saveAbi(contract,abi);
                    // create contract
                    return ethHelp.contract.new(contract,compiled.code,abi,'0xaf263b8b9ce09c5b8ac2abe56a2023f08e55fd97',wait);
                })
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
     * Executes a message call transaction, which is directly executed in the VM of the node, but never mined into the blockchain.
     * @public
     * @memberOf ContractModel
     * @param {string} contract Contract name
     * @param {string} sender Address of the sender, if null it will use the default one
     * @param {boolean} wait If set to true it will wait until the contract is mined. If not it will return the transactionHash straight away and some other process will have to monitor the status.
     * @custom public
     * @returns {Promise} Returns a new promise with the contract detail.
     */
    call (contract,address,sender,data,wait) {

        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            ethHelp.util.status().then(function(result){

                ethHelp.contract.get(contract)
                .then(function (result) {
                    //TODO DO WE NEED THIS?
                    return ethHelp.contract.instance(contract,address);
                })
                .then(function (result) {
                    ethHelp.account.default(sender);
                    return ethHelp.trx.call(address,data);
                })
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
     * Sends a transaction to the network.
     * @public
     * @memberOf ContractModel
     * @param {string} contract Contract name
     * @param {string} sender Address of the sender, if null it will use the default one
     * @param {boolean} wait If set to true it will wait until the contract is mined. If not it will return the transactionHash straight away and some other process will have to monitor the status.
     * @custom public
     * @returns {Promise} Returns a new promise with the contract detail.
     */
    sendTransaction (contract,from,data,method) {

        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            ethHelp.util.status().then(function(result){

                ethHelp.contract.call(contract,from,data,method)
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

}

module.exports = ContractModel;
