/*jslint node: true*/
/*jshint maxstatements: 100 */
'use strict';

const
    config = require('config'),
    xreq = require('xreq'),
    server = xreq.server,
    exceptions = xreq.exceptions,
    ethcontract = xreq.ethcontract,
    ethtransaction = xreq.ethtransaction,
    models = xreq.models,
    mocks = xreq.mocks,
    structs = xreq.structs,
    client = require('mongodb').MongoClient,
    bluebird = require('bluebird'),
    i18n = new (require('i18n-2'))({
      // setup some locales - other locales default to the first locale
      locales: config.locales
    });

function load(xcatalog, onTest) {

  const
      url = onTest ? config.mongodb.url_test : config.mongodb.url;

    xcatalog
    //Driver
    //.set('db', 'constant', client.connect(url, { promiseLibrary: bluebird }))

    // cross dependencies
      .set('xcatalog', 'constant', xcatalog)
      .set('moment', 'constant', require('moment'))
      .set('restify', 'constant', require('restify'))
      .set('logger', 'constant', require('bunyan'))
      .set('i18n', 'constant', i18n)
      .set('unirest', 'constant', require('unirest'))
      .set('util', 'constant', require('util'))
      .set('check', 'constant', require('check-types'))
      .set('app_name', 'constant', xreq('package.json').name)
      .set('app_version', 'constant', xreq('package.json').version)
      .set('config', 'constant', config)
      .set('enume', 'constant', require('./../../lib/enum'))
      .set('response', 'constant', structs('Response'))
      .set('exceptions', 'constant', exceptions('ServiceExceptions'))
      .set('ServerExceptions', 'singleton', require('./exception/serverExceptions'), ['i18n', 'restify', 'logger', 'util', 'exceptions'])
      // Server

      // Ethereum Contracts
      .set('contractModel', 'singleton', ethcontract('ContractModel'), ['i18n', 'enume', 'moment', 'config', 'ethHelper'])
      .set('ethContractService', 'singleton', ethcontract('ContractService'), ['xcatalog', 'moment', 'i18n', 'enume', 'exceptions','contractModel'])

      // Ethereum Transactions
      .set('transactionModel', 'singleton', ethtransaction('TransactionModel'), ['i18n', 'enume', 'moment', 'config', 'ethHelper'])
      .set('ethTrxService', 'singleton', ethtransaction('TransactionService'), ['xcatalog', 'moment', 'i18n', 'enume', 'exceptions','transactionModel'])


      // Ethereum Helper
      .set('ethHelper', 'constant', require('./eth/ethHelpers'))
      
      // catalog DI example
      // serverSetup is the ID of the catalog item,
      // service is the type [singleton, service, model, constant, factory]
      // Thrid parameter is for the
      .set('serverSetup', 'singleton', require('./server'), ['restify', 'logger', 'util', 'xcatalog', 'app_name', 'app_version', 'exceptions'])

      //Routes
      .set('genRouter', 'singleton', require('./routes/genRouter'), ['xcatalog', 'ServerExceptions'])
      .set('ethRouter', 'singleton', require('./routes/ethRouter'), ['xcatalog', 'ServerExceptions', 'ethContractService', 'ethTrxService', 'response', 'enume'])

    ;

    //### Core services ####


    //### Business services ###

}

module.exports = load;
