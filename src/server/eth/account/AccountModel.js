/*jslint node: true*/
/*globals Promise: true*/
/** @namespace eth */
/** @custom xxx */

'use strict';

var xreq = require('xreq'),
    helpers = xreq.helpers('modelHelpers'),
    ObjectID = require('mongodb').ObjectID;

/** @module account */
/** @custom xxx */
class AccountModel {

    /**
     * Model to handle the accounts collection
     * @param {Object} "db" - DI for database
     * @param {Object} "i18n" - DI for i18n
     * @param {Object} "enume" - DI for enum
     * @param {Object} "moment" - DI for moment
     * @param {Object} "config" - DI for config
     * @param {Object} "ethHelper" - DI for ethHelper
     * @constructor
     * @returns {Object} Returns a new AccountModel object.
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
     * Returns account details
     * @public
     * @memberOf AccountModel
     * @param {string} account Account address
     * @custom public
     * @returns {Promise} Returns a new promise with the account detail.
     * @TODO serialize javascript object and store in cookie
     */
    get (account) {

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

module.exports = AccountModel;
