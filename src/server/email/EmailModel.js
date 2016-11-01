/*jslint node: true*/
"use strict";

const nodemailer = require("nodemailer");

class EmailModel {
    constructor (smtpconfig) {
        this.transport = nodemailer.createTransport(smtpconfig);
    }
    send (msg) {
        const transport = this.transport;
        return new Promise(function (resolve, reject) {
            transport.sendMail(msg, function (err, info) {
                if (err) {
                    reject(err);
                } else {
                    resolve(info);
                }
            });
        });
    }
}

module.exports = EmailModel;
