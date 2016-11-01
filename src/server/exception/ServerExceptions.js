/*jslint node: true*/

"use strict";
class ServerExceptions {

  /**
   * Class that will handle Restify exceptions
   * @param {Object} "i18n" - DI for i18n
   * @param {Object} "restify" - DI for restify
   * @param {Object} "logger" - DI for logger
   * @param {Object} "util" - DI for util
   * @param {Object} "exceptions" - DI for exceptions
   * @constructor
   * @returns {Object} Returns a new ServerExceptions object.
   */
    constructor ( i18n, restify, logger, util, exceptions) {
        this.i18n        = i18n;
        this.restify     = restify;
        this.logger      = logger;
        this.util        = util;
        this.exceptions  = exceptions;
        //this.util.inherits(this.restify.RestError);
    }

    /**
     * Generates a new restify exception based on err instance
     * @public
     * @memberOf ServerExceptions
     * @param {object} error, Error object
     * @custom public
     * @example <caption>Error types:</caption>
     *    Base: ServiceException,
     *    AccessDenied: AccessDeniedException,
     *    NotFound: NotFoundException,
     *    Validation: ValidationException,
     *    Internal: InternalException
     * @returns {object} Returns a new restify exception object.
     */
    createException (error, req){
      
      if(error instanceof this.exceptions.Validation){
        req.log.debug('Validation error: %s', error);
        return new this.restify.InvalidArgumentError( this.i18n.__('ValidationError') + ' '+ this.util.inspect(error.errors) );
      }

      if(error instanceof this.exceptions.AccessDenied){
        req.log.debug('The access was denied to the resoruce you are trying to access %s', error);
        return new this.restify.NotAuthorizedError( this.i18n.__('AccessDeniedError') + ' '+ this.util.inspect(error) );
      }

      if(error instanceof this.exceptions.NotFound){
        req.log.warn('Resouce not found exception: %s', error);
        return new this.restify.ResourceNotFoundError  ( this.i18n.__('NotFoundError') + " on " +  error.collection + " " +  error.resource );
      }

      if(error instanceof this.exceptions.Internal){
        req.log.info('There was an internal server error %s', error);
        return new this.restify.InternalServerError( this.i18n.__('InternalError') + ' '+ this.util.inspect(error) );
      }

      if(error instanceof this.exceptions.Base){
        req.log.info('There was a problem processing your request %s', error);
        return new this.restify.InternalServerError( this.i18n.__('BaseError') + ' '+ this.util.inspect(error) );
      }

      req.log.info('There was an internal server error %s', error);
      return new this.restify.InternalServerError( this.i18n.__('OtherError') + ' '+ this.util.inspect(error) );

    }

    createServerErrorException (errors, req){
      req.log.info('There was an internal server error %s', errors);
      return new this.restify.InternalServerError( this.i18n.__('OtherError') + ' '+ this.util.inspect(errors) );
    }

    createValidationException (errors, req){
      req.log.debug('Validation error: %s', errors);
      return new this.restify.InvalidArgumentError( this.i18n.__('ValidationError') + ' '+ this.util.inspect(errors) );
    }

    createInvalidCredentialsException(errors, req){
      req.log.debug('InvalidCredentialsError: %s', errors.toString());
      return new this.restify.InvalidCredentialsError( errors.toString() );
    }

    logException (error){

    }


    /**
     * Returns the error type (instanceof or constructor name)
     * @public
     * @memberOf ServerExceptions
     * @param {object} error, Error object
     * @custom public
     * @returns {string} instanceof or constructor name.
     */
    getExceptionInstanceOf (error){

      if(error instanceof this.exceptions.Validation)
        return "ValidationException";
      if(error instanceof this.exceptions.AccessDenied)
        return "AccessDeniedException";
      if(error instanceof this.exceptions.NotFound)
        return "NotFoundException";
      if(error instanceof this.exceptions.Internal)
        return "InternalException";
      if(error instanceof this.exceptions.Base)
        return "ServiceException";

      return error.constructor.name;

    }

}

module.exports = ServerExceptions;