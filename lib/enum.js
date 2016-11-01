/** Configurations */
/** Static enums */

/** Enums */
/** Http  */
var http = {
    status : {
        ok: 200,
        unauthorised: 401,
        internalerror: 500,
        invalidrequest: 400,
        notfound: 404
    }
};
/** Response  */
var ip = {
    response: {
        status: {
            success: 'success',
            error: 'error'
        },
        type: {
            missingfields: 'missing_fields',
            notfound: 'not_found'
        }
    }
};

/** Export variables so they are available */
exports.http = http;
exports.ip = ip;
