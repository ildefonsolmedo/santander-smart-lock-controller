/*jslint unparam: true, node: true */
"use strict";

var
    EmailTemplate = require("email-templates").EmailTemplate,
    handlebars = require("handlebars"),
    TEMPLATES = {
        default: new EmailTemplate(__dirname + "/../mail/default")
    };

module.exports = function (xcatalog, moment, emailService, restify, util, config, ServerExceptions) {

  const server = xcatalog("apiserver");

  function sendEmail(req, emailService) {

      var emailcfg = {
                        text: req.message,
                        button: {
                            uri: '/button',
                            text: 'buttonasd'
                          },
                         template : "default"
                      },
          template;
      if (!emailcfg) {
          return false;
      }
      template = TEMPLATES[emailcfg.template];
      if (!template) {
        var err = new restify.errors.InternalServerError("Missing template:" + emailcfg.template);
        return next(err);
      }
      return template.render({
          //TODO We need to use de locale of the employee
          now: moment().format("DD/MM/YYYY HH:mm"),
          config: emailcfg,
          from: {
                name : "PAYOO",
                title: "Mr",
                company : "Santander UK"
          },
          to: {
                name : "Ignacio Romero Colomo"
          },
          server: "http://localhost:8480",
          payload: {}
      }).then(function (message) {
          return emailService.send({
              subject: req.query.subject,
              from: {
                  name: "Santander UK PAYOO",
                  address: "payoo@santander.co.uk"
              },
              //TODO Include name, not only the address, see from field
              to: req.query.to,
              html: message.html
          })
      });
  }

  /* GET get wallet balances */
	server.post({ path: "/email/send", version: "1.0.0" }, function(req, res, next) {
      sendEmail(req, emailService)
        .then(function (info) {
            return next( res.json({ response: info.response }) );
        })
        .catch(function (err) {
          return next( ServerExceptions.createException(err, req) );
      });

		})

};
