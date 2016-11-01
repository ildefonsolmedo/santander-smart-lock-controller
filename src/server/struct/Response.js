'use strict';

const e = require('./../../../lib/enum');

/**
    Creates a new Response object.
    @constructor 
*/
function Response(status,code,data,message,error) {
  /** Initialization */
  
  /**
  * Code of the response
  * @type {collection}
  */

  if (error) {
    this.body = {
        status: status,
        error: {
          code: (error.code) ? error.code : e.http.status.internalerror,
          type: error.type,
          message: error.message
        } 
    };
  } else {
    this.body = {
        status: status,
        code: code,
        message: message
    };
  }
  
  if (data) {
    this.body.data = data;
  }
}

/** Get response body */
Response.prototype.getData = function() {
  return this.body.data;
};

/** Get code */
Response.prototype.getCode = function() {
  return this.body.code;
};

/** Get Message */
Response.prototype.getMessage = function() {
  return this.body.message;
};

/** Get Error */
Response.prototype.getStatus = function() {
  return this.body.status;
};

/** Export the class */
module.exports = Response;