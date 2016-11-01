/*jslint node: true*/
/*globals expect: true, Promise: true, describe: true, it: true, beforeEach: true, Map: true  */
'use strict';

var source = require('xreq').server,
    cacheFactory = source('util/cacheFactory');

describe('Utils', function () {
    describe('Cache', function () {
        it('should have a basic functionality', function () {
            var cache = cacheFactory.createMemory(), value = 'BANANA', key = 'key';

            expect(cache).property('misses').equal(0);
            expect(cache).property('hits').equal(0);
            expect(cache.size()).equal(0);

            expect(cache.get(key)).equal(undefined);

            expect(cache).property('misses').equal(1);
            expect(cache).property('hits').equal(0);

            cache.put(key, value);

            expect(cache.get(key)).equal(value);

            expect(cache).property('misses').equal(1);
            expect(cache).property('hits').equal(1);
            expect(cache.size()).equal(1);
        });

        it('should have a basic purge mechanism', function (done) {
            var cache = cacheFactory.createMemory(100), value = 'BANANA', key = 'key';

            cache.put(key, value);

            setTimeout(function () {
                expect(cache.get(key)).equal(value);
                expect(cache).property('misses').equal(0);
                expect(cache).property('hits').equal(1);
                expect(cache.size()).equal(1);
            }, 10);

            setTimeout(function () {
                expect(cache.get(key)).equal(undefined);
                expect(cache).property('misses').equal(1);
                expect(cache).property('hits').equal(1);
                expect(cache.size()).equal(1);
            }, 120);

            setTimeout(function () {
                expect(cache.get(key)).equal(undefined);
                expect(cache).property('misses').equal(2);
                expect(cache).property('hits').equal(1);
                expect(cache.size()).equal(0);
                done();
            }, 200);

        });

    });
    describe('Validator', function () {
        var Validator = source('util/Validator');
        describe('#isoDate(dateStr)', function () {
            var isoDate = Validator.isoDate;
            it('should return true on valid dates', function () {
                expect(isoDate('2015-01-01')).equal(true);
            });
            it('should return false on invalid dates', function () {
                expect(isoDate('22015-01-01')).equal(false);
                expect(isoDate('2015-1-01')).equal(false);
                expect(isoDate('2015-01-1')).equal(false);
                expect(isoDate('2015-01-01a')).equal(false);
                expect(isoDate('2015-02-29')).equal(false);
            });
        });
        it('should validate complex objects', function () {
            const
                obj = {
                    a: { a: 10, b: 'BANANA' },
                    b: { a: 20, b: 'APPLE' },
                    c: 10,
                    d: 'ORANGE'
                },
                validator = new Validator(obj),
                validatorA = validator.prop('a'),
                validatorB = validator.prop('b');

            expect(validator.hasErrors()).equal(false);
            expect(validator.getErrors()).eql([]);

            expect(validatorA.path('a', ['number', ['gt', 10]])).equal(false);

            expect(validatorA.hasErrors()).equal(true);
            expect(validatorA.getErrors()).length(1);
            expect(validatorA.getErrors()[0]).property('path').equals('a');

            expect(validator.hasErrors()).equal(true);
            expect(validator.getErrors()).length(1);
            expect(validator.getErrors()[0]).property('path').equals('a.a');



        });
        it('should store a collection of errors', function () {
            var obj = {
                    key01: '2015-02-30',
                    key02: '2015-02-28',
                    key03: 'red',
                    key04: 'pinky'
                },
                colors = ['red', 'green', 'blue'],
                validator = new Validator(obj);

            expect(validator.hasErrors()).equal(false);
            expect(validator.path('key01', ['isoDate'])).equal(false);
            expect(validator.path('key02', ['isoDate', ['gte', '2000-01-01'], ['gte', '2500-01-01']])).equal(false);
            expect(validator.path('missingKey', ['isoDate'], false)).equal(true);
            expect(validator.path('key03', ['string', ['enum', colors]])).equal(true);
            expect(validator.path('key04', ['string', ['enum', colors]])).equal(false);
            expect(validator.hasErrors()).equal(true);

            expect(validator.getErrors()).deep.equal([
                { path: 'key01', constrain: 'isoDate', value: '2015-02-30' },
                { path: 'key02', constrain: [ 'gte', '2500-01-01' ], value: '2015-02-28' },
                { path: 'key04', constrain: [ 'enum', colors ], value: 'pinky' } ]);
        });
    });
});