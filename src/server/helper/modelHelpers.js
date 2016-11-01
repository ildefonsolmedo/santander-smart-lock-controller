/*jslint node: true*/

'use strict';

var Exceptions = require('./../exception/ModelExceptions');

function throwDuplicateKey(reason) {
    if (reason && reason.name === 'MongoError' && reason.code === 11000) {
        throw new Exceptions.DuplicateKey('Duplicated key');
    }
    throw reason;
}

module.exports = {
    copyAndMap : function (orig, dest, fields) {
        Object.keys(fields).forEach(function (key) {
            if (orig[key] !== undefined) {
                dest[fields[key]] = orig[key];
            }
        });
        return dest;
    },
    json: {
        getFirst: function (json) {
            var firstProp;
            for(var key in json) {
                if(json.hasOwnProperty(key)) {
                    firstProp = json[key];
                    break;
                }
            }
            return firstProp;
        }
    },
    mongodb: {
        findOneById: function (collection, id) {
            return collection.findOne({ '_id': id }, { '_id': 0 }).then(function (doc) {
                if (!doc) { return null; }
                doc.id = id;
                return doc;
            });
        },
        insertOne: function (collection, doc) {
            return collection.insertOne(doc).then(function (r) {
                return r.insertedId;
            }).catch(throwDuplicateKey);
        },

        updateOne: function (collection, selector, document, options) {
            return collection.updateOne(selector, document, options).then(function (r) {
                return r.matchedCount ? r.modifiedCount || r.upsertedCount : null;
            }).catch(throwDuplicateKey);
        },

        deleteAll: function (collection) {
            return collection.deleteMany({}).then(function (r) {
                return r.deletedCount;
            });
        },
        deleteOneById: function (collection, id) {
            return collection.deleteOne({ '_id': id }).then(function (r) {
                return r.deletedCount || null;
            });
        },
        count: function (collection) {
            return collection.count({});
        }
    }
};