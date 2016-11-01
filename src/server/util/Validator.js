/*jslint node: true*/
'use strict';
const moment = require('moment');


class Validator {

    constructor (obj, prop) {
        this.obj = obj;
        this.errors = [];
        this.props = [];
    }

    push (path, constrain, value) {
        this.errors.push({ path: path, constrain: constrain, value: value });
    }

    getErrors () {
        return this.errors.concat(this.props.reduce(function (result, prop) {
            prop.ref.getErrors().forEach(function (error) {
                result.push({
                    path: prop.path + '.' + error.path,
                    constrain: error.constrain,
                    value: error.value });
            });
            return result;
        }, []));
    }

    hasErrors () {
        return !!this.errors.length || this.props.some((prop) => prop.ref.hasErrors());
    }

    prop (prop) {
        let validator = new Validator(this.obj[prop]);
        this.props.push({ path: prop, ref: validator });
        return validator;
    }

    /**
     * Validate a path.
     * required: default true;
     */
    path (path, methods, required) {
        let itself = this, value = this.obj[path];
        required = (required !== false);
        if (!Validator.required(value)) {
            if (required) {
                itself.push(path, 'required', value);
            }
            return !required;
        }
        return methods.every(function (method) {
            var result = Validator.validate(method, value);
            if (!result) {
                itself.push(path, method, value);
            }
            return result;
        });
    }

    arraypath (path, methods, required) {
        let itself = this, values = this.obj[path];
        required = (required !== false);
        return values.every(function (value, index) {
            if (!Validator.required(value)) {
                if (required) {
                    itself.push(path + '[' + index + ']', 'required', value);
                }
                return !required;
            }
            return methods.every(function (method) {
                let result = Validator.validate(method, value);
                if (!result) {
                    itself.push(path + '[' + index + ']', method, value);
                }
                return result;
            });
        });
    }
}

/* Validation methods */

Validator.isoDate = (str) => moment(str, 'YYYY-MM-DD', true).isValid();
Validator.gte = (a, value) => value >= a;
Validator.lte = (a, value) => value <= a;
Validator.gt = (a, value) => value > a;
Validator.lt = (a, value) => value < a;
Validator.enum = (list, value) => list.indexOf(value) !== -1;
Validator.string = (value) => typeof value === 'string';
Validator.minLength = (min, value) => value.length >= min;
Validator.maxLength = (max, value) => value.length <= max;
Validator.equal = (expected, value) => expected === value;
Validator.number = (value) => typeof value === 'number';
Validator.boolean = (value) => typeof value === 'boolean';
Validator.array = (value) => Array.isArray(value);
Validator.noDuplicates = (values) => values.every(
    (value, index, array) => array.indexOf(value) === index
);
/*jslint bitwise: true*/
Validator.integer = (value) => value === +value && value === (value | 0);
/*jslint bitwise: false*/
Validator.range = (min, max, value) => value >= min && value <= max;
Validator.required = (value) => value !== undefined && !Number.isNaN(value) && value !==null;
Validator.notNaN = (value) => !Number.isNaN(value);
Validator.undefined = (value) => value === undefined;
Validator.pattern = (re, value) => re.test(value);


Validator.validate = function (method, value) {
    let result;
    if (Array.isArray(method)) {
        //Better performance than apply
        switch (method.length) {
        case 2:
            result = Validator[method[0]](method[1], value);
            break;
        case 3:
            result = Validator[method[0]](method[1], method[2], value);
            break;
        default:
            throw new TypeError('Invalid number of arguments');
        }
    } else if (typeof method === 'string') {
        result = Validator[method](value);
    } else {
        throw new TypeError('Invalid method type');
    }
    return result;
};


module.exports = Validator;
