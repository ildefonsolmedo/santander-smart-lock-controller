/*jslint node: true*/
/*globals Promise: true*/
/** @namespace eth */
/** @custom xxx */

'use strict';

var xreq = require('xreq'),
    helpers = xreq.helpers('modelHelpers'),
    ObjectID = require('mongodb').ObjectID;

/** @module transaction */
/** @custom xxx */
class TransactionModel {

    /**
     * Model to handle the transactions collection
     * @param {Object} "db" - DI for database
     * @param {Object} "i18n" - DI for i18n
     * @param {Object} "enume" - DI for enum
     * @param {Object} "moment" - DI for moment
     * @param {Object} "config" - DI for config
     * @param {Object} "ethHelper" - DI for ethHelper
     * @constructor
     * @returns {Object} Returns a new TransactionModel object.
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
     * Returns the transaction detail for a certain id
     * @public
     * @memberOf TransactionModel
     * @param {string} trxhash Transaction identifier
     * @custom public
     * @returns {Promise} Returns a new promise with the transaction detail.
     */
    get (trxhash) {

        const ethHelp = this.ethHelper;

        return new Promise(function (resolve, reject) {

            ethHelp.util.status().then(function(result){

                ethHelp.trx.get(trxhash)
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

module.exports = TransactionModel;
