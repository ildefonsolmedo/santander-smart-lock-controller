/*jslint node: true*/
/*globals Map: true, WeakMap: true*/

(function () {
    'use strict';
    var ONE_HOUR = 1000 * 60 * 60,
        caches = new WeakMap(),
        count = 0;

    function MemoryCache(expires) {
        this.expires = expires || MemoryCache.defaults.expires;
        this.map = new Map();
        this.hits = 0;
        this.misses = 0;
    }

    MemoryCache.defaults = {
        expires: ONE_HOUR
    };

    MemoryCache.prototype.put = function (key, value) {
        this.map.set(key, { time: Date.now(), data: value });
    };

    //Return undefined if nothing is found
    MemoryCache.prototype.get = function (key) {
        var map = this.map, value = map.get(key), now = Date.now(), expires = this.expires;
        if (value !== undefined && (expires < 0 || now - value.time < this.expires)) {
            this.hits += 1;
            return value.data;
        }
        this.misses += 1;
        return undefined;
    };

    MemoryCache.prototype.purge = function () {
        var now = Date.now(), expires = this.expires;
        if (expires < 0) { return; }
        this.map.forEach(function (value, key, map) {
            if (now - value.time > expires) {
                map.delete(key);
            }
        });
    };

    MemoryCache.prototype.size = function () {
        //Including already expired items
        return this.map.size;
    };

    function programPurge(id, expires) {
        if (expires < 0) {
            return;
        }
        var timer = setInterval(function () {
            var cache = caches.get(id);
            if (cache) {
                cache.purge();
            } else {
                clearInterval(timer);
            }
        }, expires + expires / 2);
    }

    function nextId() {
        //jslint happy
        count += 1;
        return count;
    }

    function createMemoryCache(expires) {
        var cache = new MemoryCache(expires), key = { id: nextId() };
        caches.set(key, cache);
        programPurge(key, cache.expires);
        return cache;
    }

    if (module) {
        module.exports = {
            createMemory: createMemoryCache
        };
    }
}());