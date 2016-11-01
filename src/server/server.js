/*jslint node: true*/
'use strict';

const
    YES         = 'yes',
    ROUTER      = 'Router',
    AUDIT       = 'AUDIT',
    LOG         = 'LOG',
    PREFIX_API  = '/api',
    request     = require('request'),
    rc          = require('restify-conductor'),
    semver      = require('semver'),
    auditlogger = require('bunyan')
    ;

/**
 * Service that will manage the creation of new API servers
 * @param {Object} 'restify' - DI for restify
 * @param {Object} 'logger' - DI for logger
 * @param {Object} 'util' - DI for util
 * @param {Object} 'app_name' - DI for app_name
 * @param {Object} 'app_version' - DI for app_version
 * @constructor
 * @returns {Object} Returns a new ServerSetup service object.
 */
function ServerSetup(restify, logger, util, xcatalog, app_name, app_version, exceptions) {
    // Service has to be called as contained dependency not as isolated function
    if (!(this instanceof ServerSetup)) {
        throw new Error('Used as a function');
    }

    this.restify      = restify;
    this.logger       = logger;
    this.util         = util;
    this.xcatalog     = xcatalog;
    this.app_name     = app_name;
    this.app_version  = app_version;
    this.exceptions   = exceptions;
}

/**
  * @public
  * @memberOf ServerSetup
  * @param {Object} 'config' - Configuration object for the new API server
  * @example <caption>Example usage of createAPIServer</caption>
  *    var server = serverSetup.createAPIServer(config);
  * @returns {Object} Returns a new API server.
*/
ServerSetup.prototype.createAPIServer = function(config) {

    var config      = config;
    var restify     = this.restify;
    var logger      = this.logger;
    var util        = this.util;
    var xcatalog    = this.xcatalog;
    var app_name    = this.app_name;
    var app_version = this.app_version;
    var exceptions  = this.exceptions;
    var server;

    /**
     * @private
     * @memberOf ServerSetup
     * Applies API global headers to avoid caching
     * @returns {Void}
     */
    var noCacheMiddleware = function noCacheMiddleware(req, res, next) {
  		res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  		res.header('Pragma', 'no-cache');
  		res.header('Expires', 0);
  		next();
  	}

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up all api routes in the new API server
     * @returns {Void}
     */
    var setupPreHandlers = function setupPreHandlers () {

      server.pre(restify.pre.sanitizePath());
      server.pre(function (req, res, next) {

          req.url = req.url.replace(PREFIX_API, '');

          var pieces = req.url.replace(/^\/+/, '').split('/');
          var version = pieces[0];

          version = version.replace(/v(\d{1})\.(\d{1})\.(\d{1})/, '$1.$2.$3');
          version = version.replace(/v(\d{1})\.(\d{1})/, '$1.$2.0');
          version = version.replace(/v(\d{1})/, '$1.0.0');

          if (semver.valid(version)) {

            req.url = req.url.replace(pieces[0], '');
            req.headers = req.headers || [];
            req.headers['accept-version'] = version;

          } else {

            if (req.url!='/') {
              return next(new restify.InvalidVersionError('This is an invalid version'));   
            }

          }

          next();
      });

      return;
    }

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up all API routes in the new API server
     * @returns {Void}
     */
    var setupRoutes = function setupRoutes () {
        config.routers.map(
            item => xcatalog(item + 'Router')
        )

  	 return;

  	}

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up parsing, zipping, logging,...
     * @returns {Void}
     */
    var setupUses = function use () {

  	  server.use(restify.acceptParser(server.acceptable ));
  	  server.use(restify.queryParser());
  	  server.use(restify.bodyParser());
  	  server.use(restify.gzipResponse());
  	  server.use(restify.fullResponse());
  	  server.use(restify.requestLogger({}));
  	  server.use(noCacheMiddleware);

  	  return;
    }

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up a root route for heartbeat
     * @returns {Void}
     */
    var setUpHeartBeat = function setUpHeartBeat () {

      var heartbeatConductor = rc.createConductor({
          name: 'heartbeatConductor',
          handlers: [
              function render(req, res, next) {
                  res.json( {name: app_name , version: app_version , date: new Date() });
                  return next();
              }
          ]
      });

      rc.get('/', heartbeatConductor, server);

      return;
  	}


    /**
     * @private
     * @memberOf ServerSetup
     * Sets up an auditer instance to write audit logs
     * @returns {Void}
     */
    var setUpAuditer = function setUpAuditer () {

      server.on('after', restify.auditLogger({
       log: auditlogger.createLogger({
         name: app_name + AUDIT,
         streams: [{
            type: 'rotating-file',
            path: './'+ config.log.path +'/'+ app_name +'_'+ AUDIT +'.log',
            period: config.log.rotation_period,   // daily rotation
            count: config.log.back_copies_count  // back copies
        }]
       })
      }));
  		return;
  	}

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up a static server for documentation files
     * @returns {Void}
     */
    var setUpStaticDocServer = function setUpStaticDocServer () {
      server.get(/\/docs\/v1\/?.*/, restify.serveStatic({
        directory: __dirname + '../../../',
        default: 'index.html'
      }))

    }

    /**
     * @private
     * @memberOf ServerSetup
     * Sets up a static server for swagger files
     * @returns {Void}
     */
    var setUpSwaggerServer = function setUpSwaggerServer () {
      server.get(/\/swagger\/dist\/?.*/, restify.serveStatic({
        directory: __dirname + '../../../',
        default: 'index.html'
      }))

    }

    /**
     * @private
     * @memberOf ServerSetup
     * Returns a formatted json object for error response
     * @returns {Object} body object for the json response
     */
    var formartErrorResponse = function formartErrorResponse (body) {

      let message = (body.message === '')?body.we_cause:body.message;
      let error   = null;

      if(message instanceof Error){
        if(message.name)
          message = 'Error: '+ message.name;
          if(body.name)
            message += ' '+ body.name;
      }

      let doc = {
          status: 'error',
          message: message,
          code: body.statusCode,
          body: body.body
        };

      if(body.restCode){
        doc.restCode =  body.restCode
      }

      if(body.name){
        doc.name =  body.name
      }

      if(doc.body.message === '')
        doc.body.message = message;

      if(doc.message === '')
        doc.message = message;



      return doc;
    }

    /**
     * @private
     * @memberOf ServerSetup
     * Returns a formatted json object for standard response
     * @returns {Object} body object for the json response
     */
    var formartResponse = function formartResponse (body) {

      return body = {
          code: 200,
          status: 'success',
          body: body
      };
    }

    /**
     * @private
     * @memberOf ServerSetup
     * Returns global formatters for json I/O
     * @returns {Object} json object for the response formatters
     */
    var getJsonFormaters = function getJsonFormaters () {

      return {
          'application/json': function formatJson(req, res, body, cb) {

            //error response formatter
            if (body instanceof Error){
                return cb(null, util.inspect(formartErrorResponse(body)));
            }

            if (Buffer.isBuffer(body)){
              return cb(null, formartResponse(body));
            }
            return cb(null, JSON.stringify(formartResponse(body), null, 2));
          }
        }

    }


    /**
     * @private
     * @memberOf ServerSetup
     * Returns a configuration object for restify server start up based on config
     * @returns {Object} Returns a server properties object.
     */
  	var createServerPropObject = function createServerPropObject (config, name, version) {
      // base object for any of the 2 allowed protocols
  	  var oServerProp = {
		    name: name,
		    version: version,
        formatters: getJsonFormaters()
  	  };

      // set up certs if HTTPS server
  	  if(config.protocol === 'HTTPS'){
        //Adding certs for secure server
    		if (config.tsl.cert)
    		  oServerProp.certificate = fs.readFileSync(this.config.tsl.cert);
    		if (config.tsl.key)
    		  oServerProp.key = fs.readFileSync(this.config.tsl.key);
  	  }

      // if logging enabled, create a new logger instance
      if(config.log.enabled === true){
        oServerProp.log = logger.createLogger({
          name: app_name + LOG,
          streams: [{
             type: 'rotating-file',
             src: true,
             path: './'+ config.log.path +'/'+ app_name +'_'+ LOG +'.log',
             period: config.log.rotation_period,   // daily rotation
             count: config.log.back_copies_count  // back copies
          }],
          level: config.log.level
        });
      }

      oServerProp.log.info('Server started with log level %s', config.log.level);

  	  return oServerProp;
  	}

    /**
     * @private
     * @memberOf ServerSetup
     * Applies septup sections based on config
     * @returns {Object} Returns a restify server object.
     */
  	var configServer = function configServer(){
      // handlers that run before routing occurs
  		setupPreHandlers();
      // Common api calls handlers
  		setupUses();
      //Define heartbeat routes
  		setUpHeartBeat();
      //Add all routes
  		setupRoutes();
      //If audit requested, enable auditer
      if(config.log.audit === YES)
  		    setUpAuditer();
      if (config.documentation.enabled === true) {
          setUpStaticDocServer();
          setUpSwaggerServer();
      }
      
      //When server is ready, start it up
      startServer();


  		return server;
  	}

    /**
     * @private
     * @memberOf ServerSetup
     * Starts a newly created API server to listen in configured port
     * @returns {Promise} Returns a promise that will be resolved when server is listening.
     */
    var startServer = function startServer () {

     return server.listen(config.port, function () {
       console.log(config.protocol + ' Server listening on port: ' + config.port);
     });
    }

    /**
     * @private
     * @memberOf ServerSetup
     * Creates a new API server (protocol based) and configures it
     * @returns {Object} Returns a restify server object to be configured and started.
     */
    var createServer = function createServer () {

      if (config.protocol === 'HTTPS') {
        server = restify.createServer(createServerPropObject(config, app_name, app_version));
        xcatalog.set('apiserver', 'constant', server);
        configServer(server);
        } else if (config.protocol === 'HTTP') {
          server = restify.createServer(createServerPropObject(config, app_name, app_version));
          xcatalog.set('apiserver', 'constant', server);
          configServer(server);
          } else {
            throw new TypeError('Missing protocol or invalid value: ' + config.protocol);
          }

     return server;
    }


    return createServer(server);
}


module.exports = ServerSetup;
