/*jslint node: true*/
/*globals expect:true, Promise: true, Symbol: true, describe: true, it: true, before: true, after: true*/
'use strict';

var config = require('config');

function generateArray(size, value) {
    var i, array = new Array(size);
    for (i = 0; i < size; i += 1) {
        array[i] = value;
    }
    return array;
}


describe('Meta', function () {
    it('object should contains a cloned copy', function () {
        var obj = {a: 1, b: '2', c: {a: 2, b: '2'}};
        //Remove keys
        //return expect(obj).deep.contains(JSON.parse(JSON.stringify(obj)));
        return expect(obj).deep.equal(JSON.parse(JSON.stringify(obj)));
    });
    it('find duplicates', function () {
        var i, l, r = [], a = [1, 23, 14, 12, 2, 1, 516, 3, 23, 12, 12];
        for (i = 0, l = a.length - 1; i < l; i += 1) {
            if (r.indexOf(a[i]) === -1 && a.indexOf(a[i], i + 1) !== -1) {
                r.push(a[i]);
            }
        }
        expect(r).deep.equal([1, 23, 12]);
    });
    it('require scopes', function () {
        require('./helpers').resetCounter();
        require('./helpers').increaseCounter();
        require('./helpers').increaseCounter();
        expect(require('./helpers').getCounter()).equal(2);
    });

    function intersects(a, b) {
        //Treated as close intervals
        return a.from <= b.to && a.to >= b.from;
    }

    it('should detect an interval intersection', function () {
        var from = 10, to = 15, value = { from: from, to: to },
            intervals = [
                { from: from - 2, to: from - 1, expected: false },
                { from: value.to + 1, to: to + 2, expected: false },
                { from: from, to: to, expected: true },
                { from: from, to: to + 1, expected: true },
                { from: from, to: to - 1, expected: true },
                { from: from + 1, to: to, expected: true },
                { from: from - 1, to: to, expected: true },
                { from: from + 1, to: to + 1, expected: true },
                { from: from + 1, to: to - 1, expected: true },
                { from: from - 1, to: to + 1, expected: true },
                { from: from - 1, to: to - 1, expected: true }
            ];
        intervals.forEach(function (interval) {
            expect(intersects(value, interval), JSON.stringify(interval)).equal(interval.expected);
        });
    });

    describe('Pattern for decimal numbers', function () {
        const pattern = /^(?:([1-9][0-9]*)|0)(?:\.[0-9]+)?$/;
        it('should match any decimal number', function () {
            expect('0.3').to.match(pattern);
            expect('0.30').to.match(pattern);
            expect('0.00').to.match(pattern);
            expect('12.32').to.match(pattern);
            expect('0').to.match(pattern);
            expect('2').to.match(pattern);
            expect(2.777).to.match(pattern);
        });
        it('should not match any incorrectly formatted dedimal number or any other text', function () {
            expect('0b02').not.to.match(pattern);
            expect('8.').not.to.match(pattern);
            expect('.02').not.to.match(pattern);
            expect('AAAA').not.to.match(pattern);
        });
    });

    describe('Promises', function () {
        it('should reject the current promise when return a rejected promise', function () {
            return expect(Promise.resolve(true).then(function () {
                return Promise.reject(new Error());
            })).rejectedWith(Error);
        });
        it('should ignore not function values on then method', function () {
            return expect(Promise.resolve(true).then(43)).become(true);
        });
        it('should get the promise result when resolve a promise with another promise', function () {
            return expect(Promise.resolve(Promise.resolve(3))).become(3);
        });
        it('should become undefined', function () {
            return expect(Promise.resolve(3).then(function () { return; })).become(undefined);
        });
        it('should reject from a fulfilled that returns a rejected', function () {
            return expect(Promise.resolve(3).then(function () {
                return Promise.reject(new Error());
            })).rejectedWith(Error);
        });
    });

    describe('Sequential execution of asynchronous reduce', function () {
        var Bluebird = require('bluebird'),
            VALUES = generateArray(200, 2),
            fn = function (v) { return v * 2; },
            TOTAL = VALUES.reduce(function (p, c) { return p + fn(c); }, 0);

        this.timeout(0);

        before(function (done) {
            setTimeout(done, 1000);
        });

        function fnpromise(v) {
            return new Promise(function (resolve) {
                process.nextTick(function () {
                    resolve(fn(v));
                });
            });
        }

        function fnbluebird(v) {
            return new Bluebird(function (resolve) {
                process.nextTick(function () {
                    resolve(fn(v));
                });
            });
        }

        function fncb(v, cb) {
            process.nextTick(function () {
                cb(null, fn(v));
            });
        }

        it('should eventually return the correct value using promises and reduce', function () {
            return VALUES.reduce(function (p, c) {
                return p.then(function (pvalue) {
                    return fnpromise(c).then(function (cvalue) {
                        return pvalue + cvalue;
                    });
                });
            }, Promise.resolve(0)).then(function (total) {
                expect(total).equal(TOTAL);
            });
        });

        it('should eventually return the correct value using promises and reduce (Bluebird)', function () {
            var fncbp = Bluebird.promisify(fncb);
            return Bluebird.reduce(VALUES, function (p, c) {
                return fncbp(c).then(function (v) { return v + p; });
            }, 0).then(function (total) {
                expect(total).equal(TOTAL);
            });
        });

        it('should eventually return the correct value using promises and an iterator', function () {
            var iter = VALUES[Symbol.iterator]();
            return expect((function loop(iter, total) {
                var next = iter.next();
                if (next.done) {
                    return Promise.resolve(total);
                }
                return fnpromise(next.value).then(function (v) {
                    return loop(iter, total + v);
                });
            }(iter, 0))).become(TOTAL);
        });

        it('should eventually return the correct value using promises and an iterator ' +
            '(Bluebird + promisify)', function () {
                var iter = VALUES[Symbol.iterator](),
                    fncbp = Bluebird.promisify(fncb);
                return expect((function loop(iter, total) {
                    var next = iter.next();
                    if (next.done) {
                        return Promise.resolve(total);
                    }
                    return fncbp(next.value).then(function (v) {
                        return loop(iter, total + v);
                    });
                }(iter, 0))).become(TOTAL);
            });

        it('should eventually return the correct value using promises and an iterator (Bluebird)', function () {
            var iter = VALUES[Symbol.iterator]();
            return expect((function loop(iter, total) {
                var next = iter.next();
                if (next.done) {
                    return Promise.resolve(total);
                }
                return fnbluebird(next.value).then(function (v) {
                    return loop(iter, total + v);
                });
            }(iter, 0))).become(TOTAL);
        });


        it('should eventually return the correct value using callbacks and an iterator', function (done) {
            var iter = VALUES[Symbol.iterator]();
            (function loop(iter, total) {
                var next = iter.next();
                if (next.done) {
                    expect(total).equal(TOTAL);
                    done();
                } else {
                    fncb(next.value, function (err, v) {
                        expect(err).equal(null);
                        loop(iter, total + v);
                    });
                }
            }(iter, 0));
        });

    });

    describe('JSON serialization', function () {
        it('should ignore undefined fields and include null ones', function () {
            expect(JSON.stringify({ a: 1, b: undefined })).equal(JSON.stringify({ a: 1 }));
            expect(JSON.stringify({ a: 1, b: null })).not.equal(JSON.stringify({ a: 1 }));
        });
    });

    describe('Text format', function () {
        var PARAM_RE = /\{(\d+)\}/g;
        /*jslint unparam:true*/
        function strformat(str, params) {
            return str.replace(PARAM_RE, function (match, index) {
                return params[index];
            });
        }
        /*jslint unparam:false*/
        it('should replace all the parameters', function () {
            expect(strformat('{1} + {2} = {0}', [10, 4, 6])).equal('4 + 6 = 10');
        });
    });

    describe('helpers', function () {
        const helpers = require('./helpers');
        describe('deepFreeze', function () {
            it('should throw a TypeError', function () {
                var obj = helpers.deepFreeze({ a: 'A string', b: [{ a: 1 }]});
                expect(function () { obj.a += obj.a; }).throw(TypeError);
                expect(function () { obj.b.push('b'); }).throw(TypeError);
                expect(function () { obj.b[0].a = 7; }).throw(TypeError);
            });
        });
    });


});
