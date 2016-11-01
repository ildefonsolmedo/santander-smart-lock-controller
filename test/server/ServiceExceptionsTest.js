/*jslint node: true*/
/*globals expect: true, describe: true, it: true*/
'use strict';

var source = require('xreq').server;

describe('Service Exceptions', function () {
    var Exceptions = source('exception/ServiceExceptions');
    //Slip into different tests to improve specs.
    it('Every exception should  and proper inheritance', function () {
        var base = new Exceptions.Base('banana'),
            notFound = new Exceptions.NotFound('teams', 'bananateam'),
            accessDenied = new Exceptions.AccessDenied(),
            validation = new Exceptions.Validation(['error1', 'error2']),
            internal = new Exceptions.Internal('banana');

        expect(base).instanceOf(Error);
        expect(base.name).equal('ServiceException');
        expect(base.message).equal('banana');

        expect(notFound).instanceOf(Exceptions.Base);
        expect(notFound.name).equal('NotFoundException');
        expect(notFound.collection).equal('teams');
        expect(notFound.resource).equal('bananateam');

        expect(accessDenied).instanceOf(Exceptions.Base);
        expect(accessDenied.name).equal('AccessDeniedException');

        expect(validation).instanceOf(Exceptions.Base);
        expect(validation.name).equal('ValidationException');
        expect(validation.errors).deep.equal(['error1', 'error2']);

        expect(internal).instanceOf(Exceptions.Base);
        expect(internal.name).equal('InternalException');
        expect(internal.message).equal('banana');
    });

});
