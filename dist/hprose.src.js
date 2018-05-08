// Hprose for WeChat App v2.0.4
// Copyright (c) 2008-2016 http://hprose.com
// Hprose is freely distributable under the MIT license.
// For all details and documentation:
// https://github.com/hprose/hprose-wx

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Init.js                                                *
 *                                                        *
 * hprose init for WeChat App.                            *
 *                                                        *
 * LastModified: Nov 22, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

var hprose = Object.create(null);
/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Helper.js                                              *
 *                                                        *
 * hprose helper for WeChat App.                          *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function(hprose) {
    'use strict';
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }
            var aArgs   = Array.prototype.slice.call(arguments, 1),
                toBind = this,
                NOP    = function() {},
                bound  = function() {
                    return toBind.apply(this instanceof NOP ? this : oThis,
                            aArgs.concat(Array.prototype.slice.call(arguments)));
                };
            if (this.prototype) {
                NOP.prototype = this.prototype;
            }
            bound.prototype = new NOP();
            return bound;
        };
    }

    function generic(method) {
        if (typeof method !== "function") {
            throw new TypeError(method + " is not a function");
        }
        return function(context) {
            return method.apply(context, Array.prototype.slice.call(arguments, 1));
        };
    }

    function genericMethods(obj, properties) {
        var proto = obj.prototype;
        for (var i = 0, len = properties.length; i < len; i++) {
            var property = properties[i];
            var method = proto[property];
            if (typeof method === 'function' && typeof obj[property] === 'undefined') {
                Object.defineProperty(obj, property, { value: generic(method) });
            }
        }
    }

    genericMethods(Array, [
        "pop",
        "push",
        "reverse",
        "shift",
        "sort",
        "splice",
        "unshift",
        "concat",
        "join",
        "slice",
        "indexOf",
        "lastIndexOf",
        "filter",
        "forEach",
        "every",
        "map",
        "some",
        "reduce",
        "reduceRight",
        "includes",
        "find",
        "findIndex"
    ]);
    genericMethods(String, [
        'quote',
        'substring',
        'toLowerCase',
        'toUpperCase',
        'charAt',
        'charCodeAt',
        'indexOf',
        'lastIndexOf',
        'include',
        'startsWith',
        'endsWith',
        'repeat',
        'trim',
        'trimLeft',
        'trimRight',
        'toLocaleLowerCase',
        'toLocaleUpperCase',
        'match',
        'search',
        'replace',
        'split',
        'substr',
        'concat',
        'slice'
    ]);

    var arrayLikeObjectArgumentsEnabled = true;

    try {
        String.fromCharCode.apply(String, new Uint8Array([1]));
    }
    catch (e) {
        arrayLikeObjectArgumentsEnabled = false;
    }

    function toArray(arrayLikeObject) {
        var n = arrayLikeObject.length;
        var a = new Array(n);
        for (var i = 0; i < n; ++i) {
            a[i] = arrayLikeObject[i];
        }
        return a;
    }

    var getCharCodes = arrayLikeObjectArgumentsEnabled ? function(bytes) { return bytes; } : toArray;

    function toBinaryString(bytes) {
        if (bytes instanceof ArrayBuffer) {
            bytes = new Uint8Array(bytes);
        }
        var n = bytes.length;
        if (n < 0xFFFF) {
            return String.fromCharCode.apply(String, getCharCodes(bytes));
        }
        var remain = n & 0x7FFF;
        var count = n >> 15;
        var a = new Array(remain ? count + 1 : count);
        for (var i = 0; i < count; ++i) {
            a[i] = String.fromCharCode.apply(String, getCharCodes(bytes.subarray(i << 15, (i + 1) << 15)));
        }
        if (remain) {
            a[count] = String.fromCharCode.apply(String, getCharCodes(bytes.subarray(count << 15, n)));
        }
        return a.join('');
    }

    function parseuri(url) {
        var pattern = new RegExp("^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?");
        var matches =  url.match(pattern);
        var host = matches[4].split(':', 2);
        return {
            protocol: matches[1],
            host: matches[4],
            hostname: host[0],
            port: parseInt(host[1], 10) || 0,
            path: matches[5],
            query: matches[7],
            fragment: matches[9]
        };
    }

    function isObjectEmpty(obj) {
        if (obj) {
            var prop;
            for (prop in obj) {
                return false;
            }
        }
        return true;
    }

    hprose.generic = generic;
    hprose.toBinaryString = toBinaryString;
    hprose.parseuri = parseuri
    hprose.isObjectEmpty = isObjectEmpty;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * TimeoutError.js                                        *
 *                                                        *
 * TimeoutError for WeChat App.                           *
 *                                                        *
 * LastModified: Nov 10, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

function TimeoutError(message) {
    Error.call(this);
    this.message = message;
    this.name = TimeoutError.name;
    if (typeof Error.captureStackTrace === 'function') {
        Error.captureStackTrace(this, TimeoutError);
    }
}
TimeoutError.prototype = Object.create(Error.prototype);
TimeoutError.prototype.constructor = TimeoutError;

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * setImmediate.js                                        *
 *                                                        *
 * setImmediate for WeChat App.                           *
 *                                                        *
 * LastModified: Nov 22, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function(hprose) {
    'use strict';
    var nextId = 1;
    var tasks = {};

    function wrap(handler) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            handler.apply(undefined, args);
        };
    }

    function run(handleId) {
        var task = tasks[handleId];
        if (task) {
            try {
                task();
            }
            finally {
                delete tasks[handleId];
            }
        }
    }

    function create(args) {
        tasks[nextId] = wrap.apply(undefined, args);
        return nextId++;
    }

    hprose.setImmediate = (function() {
        return function() {
            var handleId = create(arguments);
            setTimeout( wrap( run, handleId ), 0 );
            return handleId;
        };
    })();

    hprose.clearImmediate = function(handleId) {
        delete tasks[handleId];
    };

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Map.js                                                 *
 *                                                        *
 * hprose Map for WeChat App.                             *
 *                                                        *
 * LastModified: Nov 22, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global Map, WeakMap */
(function(hprose) {
    'use strict';
    var namespaces = Object.create(null);
    var count = 0;

    if ((typeof Map === 'function') && (typeof WeakMap === 'function')) {
        hprose.Map = Map;
        hprose.WeakMap = WeakMap;
        return;
    }

    function reDefineValueOf(obj) {
        var privates = Object.create(null);
        var baseValueOf = obj.valueOf;
        Object.defineProperty(obj, 'valueOf', {
            value: function (namespace, n) {
                    if ((this === obj) &&
                        (n in namespaces) &&
                        (namespaces[n] === namespace)) {
                        if (!(n in privates)) {
                            privates[n] = Object.create(null);
                        }
                        return privates[n];
                    }
                    else {
                        return baseValueOf.apply(this, arguments);
                    }
                },
            writable: true,
            configurable: true,
            enumerable: false
        });
    }

    function MyWeakMap() {
        var namespace = Object.create(null);
        var n = count++;
        namespaces[n] = namespace;
        var map = function (key) {
            if (key !== Object(key)) {
                throw new Error('value is not a non-null object');
            }
            var privates = key.valueOf(namespace, n);
            if (privates !== key.valueOf()) {
                return privates;
            }
            reDefineValueOf(key);
            return key.valueOf(namespace, n);
        };
        var m = Object.create(MyWeakMap.prototype, {
            get: {
                value: function (key) {
                    return map(key).value;
                }
            },
            set: {
                value: function (key, value) {
                    map(key).value = value;
                }
            },
            has: {
                value: function (key) {
                    return 'value' in map(key);
                }
            },
            'delete': {
                value: function (key) {
                    return delete map(key).value;
                }
            },
            clear: {
                value: function () {
                    delete namespaces[n];
                    n = count++;
                    namespaces[n] = namespace;
                }
            }
        });
        if (arguments.length > 0 && Array.isArray(arguments[0])) {
            var iterable = arguments[0];
            for (var i = 0, len = iterable.length; i < len; i++) {
                m.set(iterable[i][0], iterable[i][1]);
            }
        }
        return m;
    }

    function objectMap() {
        var namespace = Object.create(null);
        var n = count++;
        var nullMap = Object.create(null);
        namespaces[n] = namespace;
        var map = function (key) {
            if (key === null) { return nullMap; }
            var privates = key.valueOf(namespace, n);
            if (privates !== key.valueOf()) { return privates; }
            reDefineValueOf(key);
            return key.valueOf(namespace, n);
        };
        return {
            get: function (key) { return map(key).value; },
            set: function (key, value) { map(key).value = value; },
            has: function (key) { return 'value' in map(key); },
            'delete': function (key) { return delete map(key).value; },
            clear: function () {
                delete namespaces[n];
                n = count++;
                namespaces[n] = namespace;
            }
        };
    }

    function noKeyMap() {
        var map = Object.create(null);
        return {
            get: function () { return map.value; },
            set: function (_, value) { map.value = value; },
            has: function () { return 'value' in map; },
            'delete': function () { return delete map.value; },
            clear: function () { map = Object.create(null); }
        };
    }

    function scalarMap() {
        var map = Object.create(null);
        return {
            get: function (key) { return map[key]; },
            set: function (key, value) { map[key] = value; },
            has: function (key) { return key in map; },
            'delete': function (key) { return delete map[key]; },
            clear: function () { map = Object.create(null); }
        };
    }

    function MyMap() {
        var map = {
            'number': scalarMap(),
            'string': scalarMap(),
            'boolean': scalarMap(),
            'object': objectMap(),
            'function': objectMap(),
            'unknown': objectMap(),
            'undefined': noKeyMap(),
            'null': noKeyMap()
        };
        var size = 0;
        var keys = [];
        var m = Object.create(MyMap.prototype, {
            size: {
                get : function () { return size; }
            },
            get: {
                value: function (key) {
                    return map[typeof(key)].get(key);
                }
            },
            set: {
                value: function (key, value) {
                    if (!this.has(key)) {
                        keys.push(key);
                        size++;
                    }
                    map[typeof(key)].set(key, value);
                }
            },
            has: {
                value: function (key) {
                    return map[typeof(key)].has(key);
                }
            },
            'delete': {
                value: function (key) {
                    if (this.has(key)) {
                        size--;
                        keys.splice(keys.indexOf(key), 1);
                        return map[typeof(key)]['delete'](key);
                    }
                    return false;
                }
            },
            clear: {
                value: function () {
                    keys.length = 0;
                    for (var key in map) { map[key].clear(); }
                    size = 0;
                }
            },
            forEach: {
                value: function (callback, thisArg) {
                    for (var i = 0, n = keys.length; i < n; i++) {
                        callback.call(thisArg, this.get(keys[i]), keys[i], this);
                    }
                }
            }
        });
        if (arguments.length > 0 && Array.isArray(arguments[0])) {
            var iterable = arguments[0];
            for (var i = 0, len = iterable.length; i < len; i++) {
                m.set(iterable[i][0], iterable[i][1]);
            }
        }
        return m;
    }

    hprose.Map = MyMap;
    hprose.WeakMap = MyWeakMap;
})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Future.js                                              *
 *                                                        *
 * hprose Future for WeChat App.                          *
 *                                                        *
 * LastModified: Dec 5, 2016                              *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global Promise */
(function (hprose, undefined) {
    'use strict';
    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var setImmediate = hprose.setImmediate;

    var foreach = Array.prototype.forEach;
    var slice = Array.prototype.slice;

    function Future(computation) {
        var self = this;
        Object.defineProperties(this, {
            _subscribers: { value: [] },
            resolve: { value: this.resolve.bind(this) },
            reject: { value: this.reject.bind(this) }
        });
        if (typeof computation === 'function') {
            setImmediate(function() {
                try {
                    self.resolve(computation());
                }
                catch(e) {
                    self.reject(e);
                }
            });
        }
    }

    function isFuture(obj) {
        return obj instanceof Future;
    }

    function toFuture(obj) {
        return isFuture(obj) ? obj : value(obj);
    }

    function isPromise(obj) {
        return 'function' === typeof obj.then;
    }

    function delayed(duration, value) {
        var computation = (typeof value === 'function') ?
                          value :
                          function() { return value; };
        var future = new Future();
        setTimeout(function() {
            try {
                future.resolve(computation());
            }
            catch(e) {
                future.reject(e);
            }
        }, duration);
        return future;
    }

    function error(e) {
        var future = new Future();
        future.reject(e);
        return future;
    }

    function value(v) {
        var future = new Future();
        future.resolve(v);
        return future;
    }

    function sync(computation) {
        try {
            var result = computation();
            return value(result);
        }
        catch(e) {
            return error(e);
        }
    }

    function promise(executor) {
        var future = new Future();
        executor(future.resolve, future.reject);
        return future;
    }

    function arraysize(array) {
        var size = 0;
        foreach.call(array, function() { ++size; });
        return size;
    }

    function all(array) {
        return toFuture(array).then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            var result = new Array(n);
            if (count === 0) { return result; }
            var future = new Future();
            foreach.call(array, function(element, index) {
                toFuture(element).then(function(value) {
                    result[index] = value;
                    if (--count === 0) {
                        future.resolve(result);
                    }
                },
                future.reject);
            });
            return future;
        });
    }

    function join() {
        return all(arguments);
    }

    function race(array) {
        return toFuture(array).then(function(array) {
            var future = new Future();
            foreach.call(array, function(element) {
                toFuture(element).fill(future);
            });
            return future;
        });
    }

    function any(array) {
        return toFuture(array).then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            if (count === 0) {
                throw new RangeError('any(): array must not be empty');
            }
            var reasons = new Array(n);
            var future = new Future();
            foreach.call(array, function(element, index) {
                toFuture(element).then(future.resolve, function(e) {
                    reasons[index] = e;
                    if (--count === 0) {
                        future.reject(reasons);
                    }
                });
            });
            return future;
        });
    }

    function settle(array) {
        return toFuture(array).then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            var result = new Array(n);
            if (count === 0) { return result; }
            var future = new Future();
            foreach.call(array, function(element, index) {
                var f = toFuture(element);
                f.complete(function() {
                    result[index] = f.inspect();
                    if (--count === 0) {
                        future.resolve(result);
                    }
                });
            });
            return future;
        });
    }

    function attempt(handler/*, arg1, arg2, ... */) {
        var thisArg = (function() { return this; })();
        var args = slice.call(arguments, 1);
        return all(args).then(function(args) {
            return handler.apply(thisArg, args);
        });
    }

    function run(handler, thisArg/*, arg1, arg2, ... */) {
        var args = slice.call(arguments, 2);
        return all(args).then(function(args) {
            return handler.apply(thisArg, args);
        });
    }

    function isGenerator(obj) {
        if (!obj) {
            return false;
        }
        return 'function' == typeof obj.next && 'function' == typeof obj['throw'];
    }

    function isGeneratorFunction(obj) {
        if (!obj) {
            return false;
        }
        var constructor = obj.constructor;
        if (!constructor) {
            return false;
        }
        if ('GeneratorFunction' === constructor.name ||
            'GeneratorFunction' === constructor.displayName) {
            return true;
        }
        return isGenerator(constructor.prototype);
    }

    function getThunkCallback(future) {
        return function(err, res) {
            if (err instanceof Error) {
                return future.reject(err);
            }
            if (arguments.length < 2) {
                return future.resolve(err);
            }
            if (err === null || err === undefined) {
                res = slice.call(arguments, 1);
            }
            else {
                res = slice.call(arguments, 0);
            }
            if (res.length == 1) {
                future.resolve(res[0]);
            }
            else {
                future.resolve(res);
            }
        };
    }

    function thunkToPromise(fn) {
        if (isGeneratorFunction(fn) || isGenerator(fn)) {
            return co(fn);
        }
        var thisArg = (function() { return this; })();
        var future = new Future();
        fn.call(thisArg, getThunkCallback(future));
        return future;
    }

    function thunkify(fn) {
        return function() {
            var args = slice.call(arguments, 0);
            var thisArg = this;
            var results = new Future();
            args.push(function() {
                thisArg = this;
                results.resolve(arguments);
            });
            try {
                fn.apply(this, args);
            }
            catch (err) {
                results.resolve([err]);
            }
            return function(done) {
                results.then(function(results) {
                    done.apply(thisArg, results);
                });
            };
        };
    }

    function promisify(fn) {
        return function() {
            var args = slice.call(arguments, 0);
            var future = new Future();
            args.push(getThunkCallback(future));
            try {
                fn.apply(this, args);
            }
            catch (err) {
                future.reject(err);
            }
            return future;
        };
    }

    function toPromise(obj) {
        if (isGeneratorFunction(obj) || isGenerator(obj)) {
            return co(obj);
        }
        return toFuture(obj);
    }

    function co(gen) {
        var thisArg = (function() { return this; })();
        if (typeof gen === 'function') {
            var args = slice.call(arguments, 1);
            gen = gen.apply(thisArg, args);
        }

        if (!gen || typeof gen.next !== 'function') {
            return toFuture(gen);
        }

        var future = new Future();

        function onFulfilled(res) {
            try {
                next(gen.next(res));
            }
            catch (e) {
                future.reject(e);
            }
        }

        function onRejected(err) {
            try {
                next(gen['throw'](err));
            }
            catch (e) {
                future.reject(e);
            }
        }

        function next(ret) {
            if (ret.done) {
                future.resolve(ret.value);
            }
            else {
                (('function' == typeof ret.value) ?
                thunkToPromise(ret.value) :
                toPromise(ret.value)).then(onFulfilled, onRejected);
            }
        }

        onFulfilled();

        return future;
    }

    function wrap(handler, thisArg) {
        return function() {
            thisArg = thisArg || this;
            return all(arguments).then(function(args) {
                var result = handler.apply(thisArg, args);
                if (isGeneratorFunction(result) || isGenerator(result)) {
                    return co.call(thisArg, result);
                }
                return result;
            });
        };
    }

    co.wrap = wrap;

    function forEach(array, callback, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.forEach(callback, thisArg);
        });
    }

    function every(array, callback, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.every(callback, thisArg);
        });
    }

    function some(array, callback, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.some(callback, thisArg);
        });
    }

    function filter(array, callback, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.filter(callback, thisArg);
        });
    }

    function map(array, callback, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.map(callback, thisArg);
        });
    }

    function reduce(array, callback, initialValue) {
        if (arguments.length > 2) {
            return all(array).then(function(array) {
                return toFuture(initialValue).then(function(value) {
                    return array.reduce(callback, value);
                });
            });
        }
        return all(array).then(function(array) {
            return array.reduce(callback);
        });
    }

    function reduceRight(array, callback, initialValue) {
        if (arguments.length > 2) {
            return all(array).then(function(array) {
                return toFuture(initialValue).then(function(value) {
                    return array.reduceRight(callback, value);
                });
            });
        }
        return all(array).then(function(array) {
            return array.reduceRight(callback);
        });
    }

    function indexOf(array, searchElement, fromIndex) {
        return all(array).then(function(array) {
            return toFuture(searchElement).then(function(searchElement) {
                return array.indexOf(searchElement, fromIndex);
            });
        });
    }

    function lastIndexOf(array, searchElement, fromIndex) {
        return all(array).then(function(array) {
            return toFuture(searchElement).then(function(searchElement) {
                if (fromIndex === undefined) {
                    fromIndex = array.length - 1;
                }
                return array.lastIndexOf(searchElement, fromIndex);
            });
        });
    }

    function includes(array, searchElement, fromIndex) {
        return all(array).then(function(array) {
            return toFuture(searchElement).then(function(searchElement) {
                return array.includes(searchElement, fromIndex);
            });
        });
    }

    function find(array, predicate, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.find(predicate, thisArg);
        });
    }

    function findIndex(array, predicate, thisArg) {
        thisArg = thisArg || (function() { return this; })();
        return all(array).then(function(array) {
            return array.findIndex(predicate, thisArg);
        });
    }

    Object.defineProperties(Future, {
        // port from Dart
        delayed: { value: delayed },
        error: { value: error },
        sync: { value: sync },
        value: { value: value },
        // Promise compatible
        all: { value: all },
        race: { value: race },
        resolve: { value: value },
        reject: { value: error },
        // extended methods
        promise: { value: promise },
        isFuture: { value: isFuture },
        toFuture: { value: toFuture },
        isPromise: { value: isPromise },
        toPromise: { value: toPromise },
        join: { value: join },
        any: { value: any },
        settle: { value: settle },
        attempt: { value: attempt },
        run: { value: run },
        thunkify: { value: thunkify },
        promisify: { value: promisify },
        co: { value: co },
        wrap: { value: wrap },
        // for array
        forEach: { value: forEach },
        every: { value: every },
        some: { value: some },
        filter: { value: filter },
        map: { value: map },
        reduce: { value: reduce },
        reduceRight: { value: reduceRight },
        indexOf: { value: indexOf },
        lastIndexOf: { value: lastIndexOf },
        includes: { value: includes },
        find: { value: find },
        findIndex: { value: findIndex }
    });

    function _call(callback, next, x) {
        setImmediate(function() {
            try {
                var r = callback(x);
                next.resolve(r);
            }
            catch(e) {
                next.reject(e);
            }
        });
    }

    function _resolve(onfulfill, next, x) {
        if (onfulfill) {
            _call(onfulfill, next, x);
        }
        else {
            next.resolve(x);
        }
    }

    function _reject(onreject, next, e) {
        if (onreject) {
            _call(onreject, next, e);
        }
        else {
            next.reject(e);
        }
    }

    Object.defineProperties(Future.prototype, {
        _value: { writable: true },
        _reason: { writable: true },
        _state: { value: PENDING, writable: true },
        resolve: { value: function(value) {
            if (value === this) {
                this.reject(new TypeError('Self resolution'));
                return;
            }
            if (isFuture(value)) {
                value.fill(this);
                return;
            }
            if ((value !== null) &&
                (typeof value === 'object') ||
                (typeof value === 'function')) {
                var then;
                try {
                    then = value.then;
                }
                catch (e) {
                    this.reject(e);
                    return;
                }
                if (typeof then === 'function') {
                    var notrun = true;
                    try {
                        var self = this;
                        then.call(value, function(y) {
                            if (notrun) {
                                notrun = false;
                                self.resolve(y);
                            }
                        }, function(r) {
                            if (notrun) {
                                notrun = false;
                                self.reject(r);
                            }
                        });
                        return;
                    }
                    catch (e) {
                        if (notrun) {
                            notrun = false;
                            this.reject(e);
                        }
                    }
                    return;
                }
            }
            if (this._state === PENDING) {
                this._state = FULFILLED;
                this._value = value;
                var subscribers = this._subscribers;
                while (subscribers.length > 0) {
                    var subscriber = subscribers.shift();
                    _resolve(subscriber.onfulfill, subscriber.next, value);
                }
            }
        } },
        reject: { value: function(reason) {
            if (this._state === PENDING) {
                this._state = REJECTED;
                this._reason = reason;
                var subscribers = this._subscribers;
                while (subscribers.length > 0) {
                    var subscriber = subscribers.shift();
                    _reject(subscriber.onreject, subscriber.next, reason);
                }
            }
        } },
        then: { value: function(onfulfill, onreject) {
            if (typeof onfulfill !== 'function') { onfulfill = null; }
            if (typeof onreject !== 'function') { onreject = null; }
            var next = new Future();
            if (this._state === FULFILLED) {
                _resolve(onfulfill, next, this._value);
            }
            else if (this._state === REJECTED) {
                _reject(onreject, next, this._reason);
            }
            else {
                this._subscribers.push({
                    onfulfill: onfulfill,
                    onreject: onreject,
                    next: next
                });
            }
            return next;
        } },
        done: { value: function(onfulfill, onreject) {
            this.then(onfulfill, onreject).then(null, function(error) {
                setImmediate(function() { throw error; });
            });
        } },
        inspect: { value: function() {
            switch (this._state) {
                case PENDING: return { state: 'pending' };
                case FULFILLED: return { state: 'fulfilled', value: this._value };
                case REJECTED: return { state: 'rejected', reason: this._reason };
            }
        } },
        catchError: { value: function(onreject, test) {
            if (typeof test === 'function') {
                var self = this;
                return this['catch'](function(e) {
                    if (test(e)) {
                        return self['catch'](onreject);
                    }
                    else {
                        throw e;
                    }
                });
            }
            return this['catch'](onreject);
        } },
        'catch': { value: function(onreject) {
            return this.then(null, onreject);
        } },
        fail: { value: function(onreject) {
            this.done(null, onreject);
        } },
        whenComplete: { value: function(action) {
            return this.then(
                function(v) { action(); return v; },
                function(e) { action(); throw e; }
            );
        } },
        complete: { value: function(oncomplete) {
            oncomplete = oncomplete || function(v) { return v; };
            return this.then(oncomplete, oncomplete);
        } },
        always: { value: function(oncomplete) {
           this.done(oncomplete, oncomplete);
        } },
        fill: { value: function(future) {
           this.then(future.resolve, future.reject);
        } },
        timeout: { value: function(duration, reason) {
            var future = new Future();
            var timeoutId = setTimeout(function() {
                future.reject(reason || new TimeoutError('timeout'));
            }, duration);
            this.whenComplete(function() { clearTimeout(timeoutId); })
                .fill(future);
            return future;
        } },
        delay: { value: function(duration) {
            var future = new Future();
            this.then(function(result) {
                setTimeout(function() {
                    future.resolve(result);
                }, duration);
            },
            future.reject);
            return future;
        } },
        tap: { value: function(onfulfilledSideEffect, thisArg) {
            return this.then(function(result) {
                onfulfilledSideEffect.call(thisArg, result);
                return result;
            });
        } },
        spread: { value: function(onfulfilledArray, thisArg) {
            return this.then(function(array) {
                return onfulfilledArray.apply(thisArg, array);
            });
        } },
        get: { value: function(key) {
            return this.then(function(result) {
                return result[key];
            });
        } },
        set: { value: function(key, value) {
            return this.then(function(result) {
                result[key] = value;
                return result;
            });
        } },
        apply: { value: function(method, args) {
            args = args || [];
            return this.then(function(result) {
                return all(args).then(function(args) {
                    return result[method].apply(result, args);
                });
            });
        } },
        call: { value: function(method) {
            var args = slice.call(arguments, 1);
            return this.then(function(result) {
                return all(args).then(function(args) {
                    return result[method].apply(result, args);
                });
            });
        } },
        bind: { value: function(method) {
            var bindargs = slice.call(arguments);
            if (Array.isArray(method)) {
                for (var i = 0, n = method.length; i < n; ++i) {
                    bindargs[0] = method[i];
                    this.bind.apply(this, bindargs);
                }
                return;
            }
            bindargs.shift();
            var self = this;
            Object.defineProperty(this, method, { value: function() {
                var args = slice.call(arguments);
                return self.then(function(result) {
                    return all(bindargs.concat(args)).then(function(args) {
                        return result[method].apply(result, args);
                    });
                });
            } });
            return this;
        } },
        forEach: { value: function(callback, thisArg) {
            return forEach(this, callback, thisArg);
        } },
        every: { value: function(callback, thisArg) {
            return every(this, callback, thisArg);
        } },
        some: { value: function(callback, thisArg) {
            return some(this, callback, thisArg);
        } },
        filter: { value: function(callback, thisArg) {
            return filter(this, callback, thisArg);
        } },
        map: { value: function(callback, thisArg) {
            return map(this, callback, thisArg);
        } },
        reduce: { value: function(callback, initialValue) {
            if (arguments.length > 1) {
                return reduce(this, callback, initialValue);
            }
            return reduce(this, callback);
        } },
        reduceRight: { value: function(callback, initialValue) {
            if (arguments.length > 1) {
                return reduceRight(this, callback, initialValue);
            }
            return reduceRight(this, callback);
        } },
        indexOf: { value: function(searchElement, fromIndex) {
            return indexOf(this, searchElement, fromIndex);
        } },
        lastIndexOf: { value: function(searchElement, fromIndex) {
            return lastIndexOf(this, searchElement, fromIndex);
        } },
        includes: { value: function(searchElement, fromIndex) {
            return includes(this, searchElement, fromIndex);
        } },
        find: { value: function(predicate, thisArg) {
            return find(this, predicate, thisArg);
        } },
        findIndex: { value: function(predicate, thisArg) {
            return findIndex(this, predicate, thisArg);
        } }
    });

    hprose.Future = Future;

    hprose.thunkify = thunkify;
    hprose.promisify = promisify;
    hprose.co = co;
    hprose.co.wrap = hprose.wrap = wrap;

    function Completer() {
        var future = new Future();
        Object.defineProperties(this, {
            future: { value: future },
            complete: { value: future.resolve },
            completeError: { value: future.reject },
            isCompleted: { get: function() {
                return ( future._state !== PENDING );
            } }
        });
    }

    hprose.Completer = Completer;

    hprose.resolved = value;

    hprose.rejected = error;

    hprose.deferred = function() {
        var self = new Future();
        return Object.create(null, {
            promise: { value: self },
            resolve: { value: self.resolve },
            reject: { value: self.reject }
        });
    };

    if (typeof Promise === 'function') {
        hprose.Promise = Promise;
        return;
    }

    function MyPromise(executor) {
        Future.call(this);
        executor(this.resolve, this.reject);
    }

    MyPromise.prototype = Object.create(Future.prototype);
    MyPromise.prototype.constructor = Future;

    Object.defineProperties(MyPromise, {
        all: { value: all },
        race: { value: race },
        resolve: { value: value },
        reject: { value: error }
    });

    hprose.Promise = MyPromise;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * BytesIO.js                                             *
 *                                                        *
 * hprose BytesIO for WeChat App.                         *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';

    var toBinaryString = hprose.toBinaryString;

    var _EMPTY_BYTES = new Uint8Array(0);
    var _INIT_SIZE = 1024;

    function writeInt32BE(bytes, p, i) {
        bytes[p++] = i >>> 24 & 0xFF;
        bytes[p++] = i >>> 16 & 0xFF;
        bytes[p++] = i >>> 8  & 0xFF;
        bytes[p++] = i        & 0xFF;
        return p;
    }

    function writeInt32LE(bytes, p, i) {
        bytes[p++] = i        & 0xFF;
        bytes[p++] = i >>> 8  & 0xFF;
        bytes[p++] = i >>> 16 & 0xFF;
        bytes[p++] = i >>> 24 & 0xFF;
        return p;
    }

    function writeString(bytes, p, str) {
        var n = str.length;
        for (var i = 0; i < n; ++i) {
            var codeUnit = str.charCodeAt(i);
            if (codeUnit < 0x80) {
                bytes[p++] = codeUnit;
            }
            else if (codeUnit < 0x800) {
                bytes[p++] = 0xC0 | (codeUnit >> 6);
                bytes[p++] = 0x80 | (codeUnit & 0x3F);
            }
            else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
                bytes[p++] = 0xE0 | (codeUnit >> 12);
                bytes[p++] = 0x80 | ((codeUnit >> 6) & 0x3F);
                bytes[p++] = 0x80 | (codeUnit & 0x3F);
            }
            else {
                if (i + 1 < n) {
                    var nextCodeUnit = str.charCodeAt(i + 1);
                    if (codeUnit < 0xDC00 && 0xDC00 <= nextCodeUnit && nextCodeUnit <= 0xDFFF) {
                        var rune = (((codeUnit & 0x03FF) << 10) | (nextCodeUnit & 0x03FF)) + 0x010000;
                        bytes[p++] = 0xF0 | (rune >> 18);
                        bytes[p++] = 0x80 | ((rune >> 12) & 0x3F);
                        bytes[p++] = 0x80 | ((rune >> 6) & 0x3F);
                        bytes[p++] = 0x80 | (rune & 0x3F);
                        ++i;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        return p;
    }

    function readShortString(bytes, n) {
        var charCodes = new Array(n);
        var i = 0, off = 0;
        for (var len = bytes.length; i < n && off < len; i++) {
            var unit = bytes[off++];
            switch (unit >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                charCodes[i] = unit;
                break;
            case 12:
            case 13:
                if (off < len) {
                    charCodes[i] = ((unit & 0x1F) << 6) |
                                    (bytes[off++] & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (off + 1 < len) {
                    charCodes[i] = ((unit & 0x0F) << 12) |
                                   ((bytes[off++] & 0x3F) << 6) |
                                   (bytes[off++] & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (off + 2 < len) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bytes[off++] & 0x3F) << 12) |
                                ((bytes[off++] & 0x3F) << 6) |
                                (bytes[off++] & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800);
                        charCodes[i] = ((rune & 0x03FF) | 0xDC00);
                        break;
                    }
                    throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            default:
                throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        if (i < n) {
            charCodes.length = i;
        }
        return [String.fromCharCode.apply(String, charCodes), off];
    }

    function readLongString(bytes, n) {
        var buf = [];
        var charCodes = new Array(0x8000);
        var i = 0, off = 0;
        for (var len = bytes.length; i < n && off < len; i++) {
            var unit = bytes[off++];
            switch (unit >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                charCodes[i] = unit;
                break;
            case 12:
            case 13:
                if (off < len) {
                    charCodes[i] = ((unit & 0x1F) << 6) |
                                    (bytes[off++] & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (off + 1 < len) {
                    charCodes[i] = ((unit & 0x0F) << 12) |
                                   ((bytes[off++] & 0x3F) << 6) |
                                   (bytes[off++] & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (off + 2 < len) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bytes[off++] & 0x3F) << 12) |
                                ((bytes[off++] & 0x3F) << 6) |
                                (bytes[off++] & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        charCodes[i++] = (((rune >> 10) & 0x03FF) | 0xD800);
                        charCodes[i] = ((rune & 0x03FF) | 0xDC00);
                        break;
                    }
                    throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            default:
                throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
            if (i >= 0x7FFF - 1) {
                var size = i + 1;
                charCodes.length = size;
                buf.push(String.fromCharCode.apply(String, charCodes));
                n -= size;
                i = -1;
            }
        }
        if (i > 0) {
            charCodes.length = i;
            buf.push(String.fromCharCode.apply(String, charCodes));
        }
        return [buf.join(''), off];
    }

    function readString(bytes, n) {
        if (n === undefined || n === null || (n < 0)) { n = bytes.length; }
        if (n === 0) { return ['', 0]; }
        return ((n < 0xFFFF) ?
                readShortString(bytes, n) :
                readLongString(bytes, n));
    }

    function readStringAsBytes(bytes, n) {
        if (n === undefined) { n = bytes.length; }
        if (n === 0) { return [_EMPTY_BYTES, 0]; }
        var i = 0, off = 0;
        for (var len = bytes.length; i < n && off < len; i++) {
            var unit = bytes[off++];
            switch (unit >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                break;
            case 12:
            case 13:
                if (off < len) {
                    off++;
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (off + 1 < len) {
                    off += 2;
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (off + 2 < len) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bytes[off++] & 0x3F) << 12) |
                                ((bytes[off++] & 0x3F) << 6) |
                                (bytes[off++] & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        i++;
                        break;
                    }
                    throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            default:
                throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        return [bytes.subarray(0, off), off];
    }

    function pow2roundup(x) {
        --x;
        x |= x >> 1;
        x |= x >> 2;
        x |= x >> 4;
        x |= x >> 8;
        x |= x >> 16;
        return x + 1;
    }

    function BytesIO() {
        var a = arguments;
        switch (a.length) {
        case 1:
            switch (a[0].constructor) {
            case Uint8Array:
                this._bytes = a[0];
                this._length = a[0].length;
                break;
            case BytesIO:
                this._bytes = a[0].toBytes();
                this._length = a[0].length;
                break;
            case String:
                this.writeString(a[0]);
                break;
            case Number:
                this._bytes = new Uint8Array(a[0]);
                break;
            default:
                this._bytes = new Uint8Array(a[0]);
                this._length = this._bytes.length;
                break;
            }
            break;
        case 2:
            this._bytes = new Uint8Array(a[0], a[1]);
            this._length = a[1];
            break;
        case 3:
            this._bytes = new Uint8Array(a[0], a[1], a[2]);
            this._length = a[2];
            break;
        }
        this.mark();
    }

    Object.defineProperties(BytesIO.prototype, {
        _bytes: { value: null, writable: true },
        _length: { value: 0, writable: true },
        _wmark: { value: 0, writable: true },
        _off: { value: 0, writable: true },
        _rmark: { value: 0, writable: true },
        _grow: { value: function(n) {
            var bytes = this._bytes;
            var required = this._length + n;
            var size = pow2roundup(required);
            if (bytes) {
                size *= 2;
                if (size > bytes.length) {
                    var buf = new Uint8Array(size);
                    buf.set(bytes);
                    this._bytes = buf;
                }
            }
            else {
                size = Math.max(size, _INIT_SIZE);
                this._bytes = new Uint8Array(size);
            }
        } },
        length: { get: function() { return this._length; } },
        capacity: { get: function() {
            return this._bytes ? this._bytes.length : 0;
        } },
        position: { get: function() { return this._off; } },
        // returns a view of the the internal buffer.
        bytes: { get : function() {
            return (this._bytes === null) ?
                    _EMPTY_BYTES :
                    this._bytes.subarray(0, this._length);
        } },
        buffer: { get : function() {
            if (this._bytes === null) {
                return _EMPTY_BYTES.buffer;
            }
            if (this._bytes.buffer.slice) {
                return this._bytes.buffer.slice(0, this._length);
            }
            var buf = new Uint8Array(this._length);
            buf.set(this._bytes.subarray(0, this._length));
            return buf.buffer;
        } },
        mark: { value: function() {
            this._wmark = this._length;
            this._rmark = this._off;
        } },
        reset: { value: function() {
            this._length = this._wmark;
            this._off = this._rmark;
        } },
        clear: { value: function() {
            this._bytes = null;
            this._length = 0;
            this._wmark = 0;
            this._off = 0;
            this._rmark = 0;
        } },
        writeByte: { value: function(b) {
            this._grow(1);
            this._bytes[this._length++] = b;
        } },
        writeInt32BE: { value: function(i) {
            if ((i === (i | 0)) && (i <= 2147483647)) {
                this._grow(4);
                this._length = writeInt32BE(this._bytes, this._length, i);
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeUInt32BE: { value: function(i) {
            if (((i & 0x7FFFFFFF) + 0x80000000 === i) && (i >= 0)) {
                this._grow(4);
                this._length = writeInt32BE(this._bytes, this._length, i | 0);
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeInt32LE: { value: function(i) {
            if ((i === (i | 0)) && (i <= 2147483647)) {
                this._grow(4);
                this._length = writeInt32LE(this._bytes, this._length, i);
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeUInt32LE: { value: function(i) {
            if (((i & 0x7FFFFFFF) + 0x80000000 === i) && (i >= 0)) {
                this._grow(4);
                this._length = writeInt32LE(this._bytes, this._length, i | 0);
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        write: { value: function(data) {
            var n = data.byteLength || data.length;
            if (n === 0) { return; }
            this._grow(n);
            var bytes = this._bytes;
            var length = this._length;
            switch (data.constructor) {
            case ArrayBuffer:
                bytes.set(new Uint8Array(data), length);
                break;
            case Uint8Array:
                bytes.set(data, length);
                break;
            case BytesIO:
                bytes.set(data.bytes, length);
                break;
            default:
                for (var i = 0; i < n; i++) {
                    bytes[length + i] = data[i];
                }
                break;
            }
            this._length += n;
        } },
        writeAsciiString: { value: function(str) {
            var n = str.length;
            if (n === 0) { return; }
            this._grow(n);
            var bytes = this._bytes;
            var l = this._length;
            for (var i = 0; i < n; ++i, ++l) {
                bytes[l] = str.charCodeAt(i);
            }
            this._length = l;
        } },
        writeString: { value: function(str) {
            var n = str.length;
            if (n === 0) { return; }
            // A single code unit uses at most 3 bytes.
            // Two code units at most 4.
            this._grow(n * 3);
            this._length = writeString(this._bytes, this._length, str);
        } },
        readByte: { value: function() {
            if (this._off < this._length) {
                return this._bytes[this._off++];
            }
            return -1;
        } },
        readInt32BE: { value: function() {
            var bytes = this._bytes;
            var off = this._off;
            if (off + 3 < this._length) {
                var result = bytes[off++] << 24 |
                             bytes[off++] << 16 |
                             bytes[off++] << 8  |
                             bytes[off++];
                this._off = off;
                return result;
            }
            throw new Error('EOF');
        } },
        readUInt32BE: { value: function() {
            var value = this.readInt32BE();
            if (value < 0) {
                return (value & 0x7FFFFFFF) + 0x80000000;
            }
            return value;
        } },
        readInt32LE: { value: function() {
            var bytes = this._bytes;
            var off = this._off;
            if (off + 3 < this._length) {
                var result = bytes[off++]       |
                             bytes[off++] << 8  |
                             bytes[off++] << 16 |
                             bytes[off++] << 24;
                this._off = off;
                return result;
            }
            throw new Error('EOF');
        } },
        readUInt32LE: { value: function() {
            var value = this.readInt32LE();
            if (value < 0) {
                return (value & 0x7FFFFFFF) + 0x80000000;
            }
            return value;
        } },
        read: { value: function(n) {
            if (this._off + n > this._length) {
                n = this._length - this._off;
            }
            if (n === 0) { return _EMPTY_BYTES; }
            return this._bytes.subarray(this._off, this._off += n);
        } },
        skip: { value: function(n) {
            if (this._off + n > this._length) {
                n = this._length - this._off;
                this._off = this._length;
            }
            else {
                this._off += n;
            }
            return n;
        } },
        // the result is an Uint8Array, and includes tag.
        readBytes: { value: function(tag) {
            var pos = Array.indexOf(this._bytes, tag, this._off);
            var buf;
            if (pos === -1) {
                buf = this._bytes.subarray(this._off, this._length);
                this._off = this._length;
            }
            else {
                buf = this._bytes.subarray(this._off, pos + 1);
                this._off = pos + 1;
            }
            return buf;
        } },
        // the result is a String, and doesn't include tag.
        // but the position is the same as readBytes
        readUntil: { value: function(tag) {
            var pos = Array.indexOf(this._bytes, tag, this._off);
            var str = '';
            if (pos === this._off) {
                this._off++;
            }
            else if (pos === -1) {
                str = readString(this._bytes.subarray(this._off, this._length))[0];
                this._off = this._length;
            }
            else {
                str = readString(this._bytes.subarray(this._off, pos))[0];
                this._off = pos + 1;
            }
            return str;
        } },
        readAsciiString: { value: function(n) {
            if (this._off + n > this._length) {
                n = this._length - this._off;
            }
            if (n === 0) { return ''; }
            return toBinaryString(this._bytes.subarray(this._off, this._off += n));
        } },
        // n is the UTF16 length
        readStringAsBytes: { value: function(n) {
            var r = readStringAsBytes(this._bytes.subarray(this._off, this._length), n);
            this._off += r[1];
            return r[0];
        } },
        // n is the UTF16 length
        readString: { value: function(n) {
            var r = readString(this._bytes.subarray(this._off, this._length), n);
            this._off += r[1];
            return r[0];
        } },
        // returns a view of the the internal buffer and clears `this`.
        takeBytes: { value: function() {
            var buffer = this.bytes;
            this.clear();
            return buffer;
        } },
        // returns a copy of the current contents and leaves `this` intact.
        toBytes: { value: function() {
            return new Uint8Array(this.bytes);
        } },
        toString: { value: function() {
            return readString(this.bytes, this._length)[0];
        } },
        clone: { value: function() {
            return new BytesIO(this.toBytes());
        } },
        trunc: { value: function() {
            this._bytes = this._bytes.subarray(this._off, this._length);
            this._length = this._bytes.length;
            this._off = 0;
            this._wmark = 0;
            this._rmark = 0;
        } }
    });

    function toString(data) {
        /* jshint -W086 */
        if (data.length === 0) { return ''; }
        switch(data.constructor) {
        case String: return data;
        case BytesIO: data = data.bytes;
        case ArrayBuffer: data = new Uint8Array(data);
        case Uint8Array: return readString(data, data.length)[0];
        default: return String.fromCharCode.apply(String, data);
        }
    }

    Object.defineProperty(BytesIO, 'toString', { value: toString });

    hprose.BytesIO = BytesIO;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/
/**********************************************************\
 *                                                        *
 * Tags.js                                                *
 *                                                        *
 * hprose tags enum for WeChat App.                       *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

hprose.Tags = {
    /* Serialize Tags */
    TagInteger     : 0x69, //  'i'
    TagLong        : 0x6C, //  'l'
    TagDouble      : 0x64, //  'd'
    TagNull        : 0x6E, //  'n'
    TagEmpty       : 0x65, //  'e'
    TagTrue        : 0x74, //  't'
    TagFalse       : 0x66, //  'f'
    TagNaN         : 0x4E, //  'N'
    TagInfinity    : 0x49, //  'I'
    TagDate        : 0x44, //  'D'
    TagTime        : 0x54, //  'T'
    TagUTC         : 0x5A, //  'Z'
    TagBytes       : 0x62, //  'b'
    TagUTF8Char    : 0x75, //  'u'
    TagString      : 0x73, //  's'
    TagGuid        : 0x67, //  'g'
    TagList        : 0x61, //  'a'
    TagMap         : 0x6d, //  'm'
    TagClass       : 0x63, //  'c'
    TagObject      : 0x6F, //  'o'
    TagRef         : 0x72, //  'r'
    /* Serialize Marks */
    TagPos         : 0x2B, //  '+'
    TagNeg         : 0x2D, //  '-'
    TagSemicolon   : 0x3B, //  ','
    TagOpenbrace   : 0x7B, //  '{'
    TagClosebrace  : 0x7D, //  '}'
    TagQuote       : 0x22, //  '"'
    TagPoint       : 0x2E, //  '.'
    /* Protocol Tags */
    TagFunctions   : 0x46, //  'F'
    TagCall        : 0x43, //  'C'
    TagResult      : 0x52, //  'R'
    TagArgument    : 0x41, //  'A'
    TagError       : 0x45, //  'E'
    TagEnd         : 0x7A  //  'z'
};

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * ClassManager.js                                        *
 *                                                        *
 * hprose ClassManager for WeChat App.                    *
 *                                                        *
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose) {
    'use strict';
    var WeakMap = hprose.WeakMap;
    var classCache = Object.create(null);
    var aliasCache = new WeakMap();

    function register(cls, alias) {
        aliasCache.set(cls, alias);
        classCache[alias] = cls;
    }

    function getClassAlias(cls) {
        return aliasCache.get(cls);
    }

    function getClass(alias) {
        return classCache[alias];
    }

    hprose.ClassManager = Object.create(null, {
        register: { value: register },
        getClassAlias: { value: getClassAlias },
        getClass: { value: getClass }
    });

    hprose.register = register;

    register(Object, 'Object');

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Writer.js                                              *
 *                                                        *
 * hprose Writer for WeChat App.                          *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var Map = hprose.Map;
    var BytesIO = hprose.BytesIO;
    var Tags = hprose.Tags;
    var ClassManager = hprose.ClassManager;

    function getClassName(obj) {
        var cls = obj.constructor;
        if (!cls) {
            return 'Object';
        }
        var classname = ClassManager.getClassAlias(cls);
        if (classname) { return classname; }
        if (cls.name) {
            classname = cls.name;
        }
        else {
            var ctor = cls.toString();
            classname = ctor.substr(0, ctor.indexOf('(')).replace(/(^\s*function\s*)|(\s*$)/ig, '');
            if (classname === '' || classname === 'Object') {
                return (typeof(obj.getClassName) === 'function') ? obj.getClassName() : 'Object';
            }
        }
        if (classname !== 'Object') {
            ClassManager.register(cls, classname);
        }
        return classname;
    }

    var fakeWriterRefer = Object.create(null, {
        set: { value: function () {} },
        write: { value: function () { return false; } },
        reset: { value: function () {} }
    });

    function RealWriterRefer(stream) {
        Object.defineProperties(this, {
            _stream: { value: stream },
            _ref: { value: new Map(), writable: true }
        });
    }

    Object.defineProperties(RealWriterRefer.prototype, {
        _refcount: { value: 0, writable: true },
        set: { value: function (val) {
            this._ref.set(val, this._refcount++);
        } },
        write: { value: function (val) {
            var index = this._ref.get(val);
            if (index !== undefined) {
                this._stream.writeByte(Tags.TagRef);
                this._stream.writeString('' + index);
                this._stream.writeByte(Tags.TagSemicolon);
                return true;
            }
            return false;
        } },
        reset: { value: function () {
            this._ref = new Map();
            this._refcount = 0;
        } }
    });

    function realWriterRefer(stream) {
        return new RealWriterRefer(stream);
    }

    function Writer(stream, simple) {
        Object.defineProperties(this, {
            stream: { value: stream },
            _classref: { value: Object.create(null), writable: true },
            _fieldsref: { value: [], writable: true },
            _refer: { value: simple ? fakeWriterRefer : realWriterRefer(stream) }
        });
    }

    function serialize(writer, value) {
        var stream = writer.stream;
        if (value === undefined || value === null) {
            stream.writeByte(Tags.TagNull);
            return;
        }
        switch (value.constructor) {
        case Function:
            stream.writeByte(Tags.TagNull);
            return;
        case Number:
            writeNumber(writer, value);
            return;
        case Boolean:
            writeBoolean(writer, value);
            return;
        case String:
            switch (value.length) {
            case 0:
                stream.writeByte(Tags.TagEmpty);
                return;
            case 1:
                stream.writeByte(Tags.TagUTF8Char);
                stream.writeString(value);
                return;
            }
            writer.writeStringWithRef(value);
            return;
        case Date:
            writer.writeDateWithRef(value);
            return;
        case Map:
            writer.writeMapWithRef(value);
            return;
        case ArrayBuffer:
        case Uint8Array:
        case BytesIO:
            writer.writeBytesWithRef(value);
            return;
        case Int8Array:
        case Int16Array:
        case Int32Array:
        case Uint16Array:
        case Uint32Array:
            writeIntListWithRef(writer, value);
            return;
        case Float32Array:
        case Float64Array:
            writeDoubleListWithRef(writer, value);
            return;
        default:
            if (Array.isArray(value)) {
                writer.writeListWithRef(value);
            }
            else {
                var classname = getClassName(value);
                if (classname === 'Object') {
                    writer.writeMapWithRef(value);
                }
                else {
                    writer.writeObjectWithRef(value);
                }
            }
            break;
        }
    }

    function writeNumber(writer, n) {
        var stream = writer.stream;
        n = n.valueOf();
        if (n === (n | 0)) {
            if (0 <= n && n <= 9) {
                stream.writeByte(n + 0x30);
            }
            else {
                stream.writeByte(Tags.TagInteger);
                stream.writeAsciiString('' + n);
                stream.writeByte(Tags.TagSemicolon);
            }
        }
        else if (isNaN(n)) {
            stream.writeByte(Tags.TagNaN);
        }
        else if (isFinite(n)) {
            stream.writeByte(Tags.TagDouble);
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagSemicolon);
        }
        else {
            stream.writeByte(Tags.TagInfinity);
            stream.writeByte((n > 0) ? Tags.TagPos : Tags.TagNeg);
        }
    }

    function writeInteger(writer, n) {
        var stream = writer.stream;
        if (0 <= n && n <= 9) {
            stream.writeByte(n + 0x30);
        }
        else {
            if (n < -2147483648 || n > 2147483647) {
                stream.writeByte(Tags.TagLong);
            }
            else {
                stream.writeByte(Tags.TagInteger);
            }
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagSemicolon);
        }
    }

    function writeDouble(writer, n) {
        var stream = writer.stream;
        if (isNaN(n)) {
            stream.writeByte(Tags.TagNaN);
        }
        else if (isFinite(n)) {
            stream.writeByte(Tags.TagDouble);
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagSemicolon);
        }
        else {
            stream.writeByte(Tags.TagInfinity);
            stream.writeByte((n > 0) ? Tags.TagPos : Tags.TagNeg);
        }
    }

    function writeBoolean(writer, b) {
        writer.stream.writeByte(b.valueOf() ? Tags.TagTrue : Tags.TagFalse);
    }

    function writeUTCDate(writer, date) {
        writer._refer.set(date);
        var stream = writer.stream;
        var year = ('0000' + date.getUTCFullYear()).slice(-4);
        var month = ('00' + (date.getUTCMonth() + 1)).slice(-2);
        var day = ('00' + date.getUTCDate()).slice(-2);
        var hour = ('00' + date.getUTCHours()).slice(-2);
        var minute = ('00' + date.getUTCMinutes()).slice(-2);
        var second = ('00' + date.getUTCSeconds()).slice(-2);
        var millisecond = ('000' + date.getUTCMilliseconds()).slice(-3);
        stream.writeByte(Tags.TagDate);
        stream.writeAsciiString(year + month + day);
        stream.writeByte(Tags.TagTime);
        stream.writeAsciiString(hour + minute + second);
        if (millisecond !== '000') {
            stream.writeByte(Tags.TagPoint);
            stream.writeAsciiString(millisecond);
        }
        stream.writeByte(Tags.TagUTC);
    }

    function writeDate(writer, date) {
        writer._refer.set(date);
        var stream = writer.stream;
        var year = ('0000' + date.getFullYear()).slice(-4);
        var month = ('00' + (date.getMonth() + 1)).slice(-2);
        var day = ('00' + date.getDate()).slice(-2);
        var hour = ('00' + date.getHours()).slice(-2);
        var minute = ('00' + date.getMinutes()).slice(-2);
        var second = ('00' + date.getSeconds()).slice(-2);
        var millisecond = ('000' + date.getMilliseconds()).slice(-3);
        if ((hour === '00') && (minute === '00') &&
            (second === '00') && (millisecond === '000')) {
            stream.writeByte(Tags.TagDate);
            stream.writeAsciiString(year + month + day);
        }
        else if ((year === '1970') && (month === '01') && (day === '01')) {
            stream.writeByte(Tags.TagTime);
            stream.writeAsciiString(hour + minute + second);
            if (millisecond !== '000') {
                stream.writeByte(Tags.TagPoint);
                stream.writeAsciiString(millisecond);
            }
        }
        else {
            stream.writeByte(Tags.TagDate);
            stream.writeAsciiString(year + month + day);
            stream.writeByte(Tags.TagTime);
            stream.writeAsciiString(hour + minute + second);
            if (millisecond !== '000') {
                stream.writeByte(Tags.TagPoint);
                stream.writeAsciiString(millisecond);
            }
        }
        stream.writeByte(Tags.TagSemicolon);
    }

    function writeTime(writer, time) {
        writer._refer.set(time);
        var stream = writer.stream;
        var hour = ('00' + time.getHours()).slice(-2);
        var minute = ('00' + time.getMinutes()).slice(-2);
        var second = ('00' + time.getSeconds()).slice(-2);
        var millisecond = ('000' + time.getMilliseconds()).slice(-3);
        stream.writeByte(Tags.TagTime);
        stream.writeAsciiString(hour + minute + second);
        if (millisecond !== '000') {
            stream.writeByte(Tags.TagPoint);
            stream.writeAsciiString(millisecond);
        }
        stream.writeByte(Tags.TagSemicolon);
    }

    function writeBytes(writer, bytes) {
        writer._refer.set(bytes);
        var stream = writer.stream;
        stream.writeByte(Tags.TagBytes);
        var n = bytes.byteLength || bytes.length;
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagQuote);
            stream.write(bytes);
        }
        else {
            stream.writeByte(Tags.TagQuote);
        }
        stream.writeByte(Tags.TagQuote);
    }

    function writeString(writer, str) {
        writer._refer.set(str);
        var stream = writer.stream;
        var n = str.length;
        stream.writeByte(Tags.TagString);
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagQuote);
            stream.writeString(str);
        }
        else {
            stream.writeByte(Tags.TagQuote);
        }
        stream.writeByte(Tags.TagQuote);
    }

    function writeArray(writer, array, writeElem) {
        writer._refer.set(array);
        var stream = writer.stream;
        var n = array.length;
        stream.writeByte(Tags.TagList);
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                writeElem(writer, array[i]);
            }
        }
        else {
            stream.writeByte(Tags.TagOpenbrace);
        }
        stream.writeByte(Tags.TagClosebrace);
    }

    function writeIntListWithRef(writer, list) {
        if (!writer._refer.write(list)) {
            writeArray(writer, list, writeInteger);
        }
    }

    function writeDoubleListWithRef(writer, list) {
        if (!writer._refer.write(list)) {
            writeArray(writer, list, writeDouble);
        }
    }

    function writeMap(writer, map) {
        writer._refer.set(map);
        var stream = writer.stream;
        var fields = [];
        for (var key in map) {
            if (map.hasOwnProperty(key) &&
                typeof(map[key]) !== 'function') {
                fields[fields.length] = key;
            }
        }
        var n = fields.length;
        stream.writeByte(Tags.TagMap);
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                serialize(writer, fields[i]);
                serialize(writer, map[fields[i]]);
            }
        }
        else {
            stream.writeByte(Tags.TagOpenbrace);
        }
        stream.writeByte(Tags.TagClosebrace);
    }

    function writeHarmonyMap(writer, map) {
        writer._refer.set(map);
        var stream = writer.stream;
        var n = map.size;
        stream.writeByte(Tags.TagMap);
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagOpenbrace);
            map.forEach(function(value, key) {
                serialize(writer, key);
                serialize(writer, value);
            });
        }
        else {
            stream.writeByte(Tags.TagOpenbrace);
        }
        stream.writeByte(Tags.TagClosebrace);
    }

    function writeObject(writer, obj) {
        var stream = writer.stream;
        var classname = getClassName(obj);
        var fields, index;
        if (classname in writer._classref) {
            index = writer._classref[classname];
            fields = writer._fieldsref[index];
        }
        else {
            fields = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key) &&
                    typeof(obj[key]) !== 'function') {
                    fields[fields.length] = key.toString();
                }
            }
            index = writeClass(writer, classname, fields);
        }
        stream.writeByte(Tags.TagObject);
        stream.writeAsciiString('' + index);
        stream.writeByte(Tags.TagOpenbrace);
        writer._refer.set(obj);
        var n = fields.length;
        for (var i = 0; i < n; i++) {
            serialize(writer, obj[fields[i]]);
        }
        stream.writeByte(Tags.TagClosebrace);
    }

    function writeClass(writer, classname, fields) {
        var stream = writer.stream;
        var n = fields.length;
        stream.writeByte(Tags.TagClass);
        stream.writeAsciiString('' + classname.length);
        stream.writeByte(Tags.TagQuote);
        stream.writeString(classname);
        stream.writeByte(Tags.TagQuote);
        if (n > 0) {
            stream.writeAsciiString('' + n);
            stream.writeByte(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                writeString(writer, fields[i]);
            }
        }
        else {
            stream.writeByte(Tags.TagOpenbrace);
        }
        stream.writeByte(Tags.TagClosebrace);
        var index = writer._fieldsref.length;
        writer._classref[classname] = index;
        writer._fieldsref[index] = fields;
        return index;
    }

    Object.defineProperties(Writer.prototype, {
        serialize: { value: function(value) {
            serialize(this, value);
        } },
        writeInteger: { value: function(value) {
            writeInteger(this, value);
        } },
        writeDouble: { value: function(value) {
            writeDouble(this, value);
        } },
        writeBoolean: { value: function(value) {
            writeBoolean(this, value);
        } },
        writeUTCDate: { value: function(value) {
            writeUTCDate(this, value);
        } },
        writeUTCDateWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeUTCDate(this, value);
            }
        } },
        writeDate: { value: function(value) {
            writeDate(this, value);
        } },
        writeDateWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeDate(this, value);
            }
        } },
        writeTime: { value: function(value) {
            writeTime(this, value);
        } },
        writeTimeWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeTime(this, value);
            }
        } },
        writeBytes: { value: function(value) {
            writeBytes(this, value);
        } },
        writeBytesWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeBytes(this, value);
            }
        } },
        writeString: { value: function(value) {
            writeString(this, value);
        } },
        writeStringWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeString(this, value);
            }
        } },
        writeList: { value: function(value) {
            writeArray(this, value, serialize);
        } },
        writeListWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeArray(this, value, serialize);
            }
        } },
        writeMap: { value: function(value) {
            if (value instanceof Map) {
                writeHarmonyMap(this, value);
            }
            else {
                writeMap(this, value);
            }
        } },
        writeMapWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                if (value instanceof Map) {
                    writeHarmonyMap(this, value);
                }
                else {
                    writeMap(this, value);
                }
            }
        } },
        writeObject: { value: function(value) {
            writeObject(this, value);
        } },
        writeObjectWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeObject(this, value);
            }
        } },
        reset: { value: function() {
            this._classref = Object.create(null);
            this._fieldsref.length = 0;
            this._refer.reset();
        } }
    });

    hprose.Writer = Writer;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Reader.js                                              *
 *                                                        *
 * hprose Reader for WeChat App.                          *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var Map = hprose.Map;
    var BytesIO = hprose.BytesIO;
    var Tags = hprose.Tags;
    var ClassManager = hprose.ClassManager;

    function unexpectedTag(tag, expectTags) {
        if (tag && expectTags) {
            var expectTagStr = '';
            if (typeof(expectTags) === 'number') {
                expectTagStr = String.fromCharCode(expectTags);
            }
            else {
                expectTagStr = String.fromCharCode.apply(String, expectTags);
            }
            throw new Error('Tag "' + expectTagStr + '" expected, but "' + String.fromCharCode(tag) + '" found in stream');
        }
        else if (tag) {
            throw new Error('Unexpected serialize tag "' + String.fromCharCode(tag) + '" in stream');
        }
        else {
            throw new Error('No byte found in stream');
        }
    }

    function readRaw(stream) {
        var ostream = new BytesIO();
        _readRaw(stream, ostream);
        return ostream.bytes;
    }

    function _readRaw(stream, ostream) {
        __readRaw(stream, ostream, stream.readByte());
    }

    function __readRaw(stream, ostream, tag) {
        ostream.writeByte(tag);
        switch (tag) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case Tags.TagNull:
            case Tags.TagEmpty:
            case Tags.TagTrue:
            case Tags.TagFalse:
            case Tags.TagNaN:
                break;
            case Tags.TagInfinity:
                ostream.writeByte(stream.readByte());
                break;
            case Tags.TagInteger:
            case Tags.TagLong:
            case Tags.TagDouble:
            case Tags.TagRef:
                readNumberRaw(stream, ostream);
                break;
            case Tags.TagDate:
            case Tags.TagTime:
                readDateTimeRaw(stream, ostream);
                break;
            case Tags.TagUTF8Char:
                readUTF8CharRaw(stream, ostream);
                break;
            case Tags.TagBytes:
                readBytesRaw(stream, ostream);
                break;
            case Tags.TagString:
                readStringRaw(stream, ostream);
                break;
            case Tags.TagGuid:
                readGuidRaw(stream, ostream);
                break;
            case Tags.TagList:
            case Tags.TagMap:
            case Tags.TagObject:
                readComplexRaw(stream, ostream);
                break;
            case Tags.TagClass:
                readComplexRaw(stream, ostream);
                _readRaw(stream, ostream);
                break;
            case Tags.TagError:
                _readRaw(stream, ostream);
                break;
            default: unexpectedTag(tag);
        }
    }
    function readNumberRaw(stream, ostream) {
        var tag;
        do {
            tag = stream.readByte();
            ostream.writeByte(tag);
        } while (tag !== Tags.TagSemicolon);
    }
    function readDateTimeRaw(stream, ostream) {
        var tag;
        do {
            tag = stream.readByte();
            ostream.writeByte(tag);
        } while (tag !== Tags.TagSemicolon &&
                 tag !== Tags.TagUTC);
    }
    function readUTF8CharRaw(stream, ostream) {
        ostream.writeString(stream.readString(1));
    }
    function readBytesRaw(stream, ostream) {
        var count = 0;
        var tag = 48;
        do {
            count *= 10;
            count += tag - 48;
            tag = stream.readByte();
            ostream.writeByte(tag);
        } while (tag !== Tags.TagQuote);
        ostream.write(stream.read(count + 1));
    }
    function readStringRaw(stream, ostream) {
        var count = 0;
        var tag = 48;
        do {
            count *= 10;
            count += tag - 48;
            tag = stream.readByte();
            ostream.writeByte(tag);
        } while (tag !== Tags.TagQuote);
        ostream.write(stream.readStringAsBytes(count + 1));
    }
    function readGuidRaw(stream, ostream) {
        ostream.write(stream.read(38));
    }
    function readComplexRaw(stream, ostream) {
        var tag;
        do {
            tag = stream.readByte();
            ostream.writeByte(tag);
        } while (tag !== Tags.TagOpenbrace);
        while ((tag = stream.readByte()) !== Tags.TagClosebrace) {
            __readRaw(stream, ostream, tag);
        }
        ostream.writeByte(tag);
    }

    function RawReader(stream) {
        Object.defineProperties(this, {
            stream: { value : stream },
            readRaw: { value: function() { return readRaw(stream); } }
        });
    }

    hprose.RawReader = RawReader;

    var fakeReaderRefer = Object.create(null, {
        set: { value: function() {} },
        read: { value: function() { unexpectedTag(Tags.TagRef); } },
        reset: { value: function() {} }
    });

    function RealReaderRefer() {
        Object.defineProperties(this, {
            ref: { value: [] }
        });
    }

    Object.defineProperties(RealReaderRefer.prototype, {
        set: { value: function(val) { this.ref.push(val); } },
        read: { value: function(index) { return this.ref[index]; } },
        reset: { value: function() { this.ref.length = 0; } }
    });

    function realReaderRefer() {
        return new RealReaderRefer();
    }

    function getClass(classname) {
        var cls = ClassManager.getClass(classname);
        if (cls) { return cls; }
        cls = function () {};
        Object.defineProperty(cls.prototype, 'getClassName', { value: function () {
            return classname;
        }});
        ClassManager.register(cls, classname);
        return cls;
    }

    function readInt(stream, tag) {
        var s = stream.readUntil(tag);
        if (s.length === 0) { return 0; }
        return parseInt(s, 10);
    }
    function unserialize(reader) {
        var stream = reader.stream;
        var tag = stream.readByte();
        switch (tag) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57: return tag - 48;
            case Tags.TagInteger: return readIntegerWithoutTag(stream);
            case Tags.TagLong: return readLongWithoutTag(stream);
            case Tags.TagDouble: return readDoubleWithoutTag(stream);
            case Tags.TagNull: return null;
            case Tags.TagEmpty: return '';
            case Tags.TagTrue: return true;
            case Tags.TagFalse: return false;
            case Tags.TagNaN: return NaN;
            case Tags.TagInfinity: return readInfinityWithoutTag(stream);
            case Tags.TagDate: return readDateWithoutTag(reader);
            case Tags.TagTime: return readTimeWithoutTag(reader);
            case Tags.TagBytes: return readBytesWithoutTag(reader);
            case Tags.TagUTF8Char: return readUTF8CharWithoutTag(reader);
            case Tags.TagString: return readStringWithoutTag(reader);
            case Tags.TagGuid: return readGuidWithoutTag(reader);
            case Tags.TagList: return readListWithoutTag(reader);
            case Tags.TagMap: return reader.useHarmonyMap ? readHarmonyMapWithoutTag(reader) : readMapWithoutTag(reader);
            case Tags.TagClass: readClass(reader); return readObject(reader);
            case Tags.TagObject: return readObjectWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            case Tags.TagError: throw new Error(readString(reader));
            default: unexpectedTag(tag);
        }
    }
    function readIntegerWithoutTag(stream) {
        return readInt(stream, Tags.TagSemicolon);
    }
    function readInteger(stream) {
        var tag = stream.readByte();
        switch (tag) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57: return tag - 48;
            case Tags.TagInteger: return readIntegerWithoutTag(stream);
            default: unexpectedTag(tag);
        }
    }
    function readLongWithoutTag(stream) {
        var s = stream.readUntil(Tags.TagSemicolon);
        var l = parseInt(s, 10);
        if (l.toString() === s) { return l; }
        return s;
    }
    function readLong(stream) {
        var tag = stream.readByte();
        switch (tag) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57: return tag - 48;
            case Tags.TagInteger:
            case Tags.TagLong: return readLongWithoutTag(stream);
            default: unexpectedTag(tag);
        }
    }
    function readDoubleWithoutTag(stream) {
        return parseFloat(stream.readUntil(Tags.TagSemicolon));
    }
    function readDouble(stream) {
        var tag = stream.readByte();
        switch (tag) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57: return tag - 48;
            case Tags.TagInteger:
            case Tags.TagLong:
            case Tags.TagDouble: return readDoubleWithoutTag(stream);
            case Tags.TagNaN: return NaN;
            case Tags.TagInfinity: return readInfinityWithoutTag(stream);
            default: unexpectedTag(tag);
        }
    }
    function readInfinityWithoutTag(stream) {
        return ((stream.readByte() === Tags.TagNeg) ? -Infinity : Infinity);
    }
    function readBoolean(stream) {
        var tag = stream.readByte();
        switch (tag) {
            case Tags.TagTrue: return true;
            case Tags.TagFalse: return false;
            default: unexpectedTag(tag);
        }
    }
    function readDateWithoutTag(reader) {
        var stream = reader.stream;
        var year = parseInt(stream.readAsciiString(4), 10);
        var month = parseInt(stream.readAsciiString(2), 10) - 1;
        var day = parseInt(stream.readAsciiString(2), 10);
        var date;
        var tag = stream.readByte();
        if (tag === Tags.TagTime) {
            var hour = parseInt(stream.readAsciiString(2), 10);
            var minute = parseInt(stream.readAsciiString(2), 10);
            var second = parseInt(stream.readAsciiString(2), 10);
            var millisecond = 0;
            tag = stream.readByte();
            if (tag === Tags.TagPoint) {
                millisecond = parseInt(stream.readAsciiString(3), 10);
                tag = stream.readByte();
                if ((tag >= 48) && (tag <= 57)) {
                    stream.skip(2);
                    tag = stream.readByte();
                    if ((tag >= 48) && (tag <= 57)) {
                        stream.skip(2);
                        tag = stream.readByte();
                    }
                }
            }
            if (tag === Tags.TagUTC) {
                date = new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));
            }
            else {
                date = new Date(year, month, day, hour, minute, second, millisecond);
            }
        }
        else if (tag === Tags.TagUTC) {
            date = new Date(Date.UTC(year, month, day));
        }
        else {
            date = new Date(year, month, day);
        }
        reader.refer.set(date);
        return date;
    }
    function readDate(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagDate: return readDateWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readTimeWithoutTag(reader) {
        var stream = reader.stream;
        var time;
        var hour = parseInt(stream.readAsciiString(2), 10);
        var minute = parseInt(stream.readAsciiString(2), 10);
        var second = parseInt(stream.readAsciiString(2), 10);
        var millisecond = 0;
        var tag = stream.readByte();
        if (tag === Tags.TagPoint) {
            millisecond = parseInt(stream.readAsciiString(3), 10);
            tag = stream.readByte();
            if ((tag >= 48) && (tag <= 57)) {
                stream.skip(2);
                tag = stream.readByte();
                if ((tag >= 48) && (tag <= 57)) {
                    stream.skip(2);
                    tag = stream.readByte();
                }
            }
        }
        if (tag === Tags.TagUTC) {
            time = new Date(Date.UTC(1970, 0, 1, hour, minute, second, millisecond));
        }
        else {
            time = new Date(1970, 0, 1, hour, minute, second, millisecond);
        }
        reader.refer.set(time);
        return time;
    }
    function readTime(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagTime: return readTimeWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readBytesWithoutTag(reader) {
        var stream = reader.stream;
        var count = readInt(stream, Tags.TagQuote);
        var bytes = stream.read(count);
        stream.skip(1);
        reader.refer.set(bytes);
        return bytes;
    }
    function readBytes(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagEmpty: return new Uint8Array(0);
            case Tags.TagBytes: return readBytesWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readUTF8CharWithoutTag(reader) {
        return reader.stream.readString(1);
    }
    function _readString(reader) {
        var stream = reader.stream;
        var s = stream.readString(readInt(stream, Tags.TagQuote));
        stream.skip(1);
        return s;
    }
    function readStringWithoutTag(reader) {
        var s = _readString(reader);
        reader.refer.set(s);
        return s;
    }
    function readString(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagEmpty: return '';
            case Tags.TagUTF8Char: return readUTF8CharWithoutTag(reader);
            case Tags.TagString: return readStringWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readGuidWithoutTag(reader) {
        var stream = reader.stream;
        stream.skip(1);
        var s = stream.readAsciiString(36);
        stream.skip(1);
        reader.refer.set(s);
        return s;
    }
    function readGuid(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagGuid: return readGuidWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readListWithoutTag(reader) {
        var stream = reader.stream;
        var list = [];
        reader.refer.set(list);
        var count = readInt(stream, Tags.TagOpenbrace);
        for (var i = 0; i < count; i++) {
            list[i] = unserialize(reader);
        }
        stream.skip(1);
        return list;
    }
    function readList(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagList: return readListWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readMapWithoutTag(reader) {
        var stream = reader.stream;
        var map = {};
        reader.refer.set(map);
        var count = readInt(stream, Tags.TagOpenbrace);
        for (var i = 0; i < count; i++) {
            var key = unserialize(reader);
            var value = unserialize(reader);
            map[key] = value;
        }
        stream.skip(1);
        return map;
    }
    function readMap(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagMap: return readMapWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readHarmonyMapWithoutTag(reader) {
        var stream = reader.stream;
        var map = new Map();
        reader.refer.set(map);
        var count = readInt(stream, Tags.TagOpenbrace);
        for (var i = 0; i < count; i++) {
            var key = unserialize(reader);
            var value = unserialize(reader);
            map.set(key, value);
        }
        stream.skip(1);
        return map;
    }
    function readHarmonyMap(reader) {
        var tag = reader.stream.readByte();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagMap: return readHarmonyMapWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readObjectWithoutTag(reader) {
        var stream = reader.stream;
        var cls = reader.classref[readInt(stream, Tags.TagOpenbrace)];
        var obj = new cls.classname();
        reader.refer.set(obj);
        for (var i = 0; i < cls.count; i++) {
            obj[cls.fields[i]] = unserialize(reader);
        }
        stream.skip(1);
        return obj;
    }
    function readObject(reader) {
        var tag = reader.stream.readByte();
        switch(tag) {
            case Tags.TagNull: return null;
            case Tags.TagClass: readClass(reader); return readObject(reader);
            case Tags.TagObject: return readObjectWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readClass(reader) {
        var stream = reader.stream;
        var classname = _readString(reader);
        var count = readInt(stream, Tags.TagOpenbrace);
        var fields = [];
        for (var i = 0; i < count; i++) {
            fields[i] = readString(reader);
        }
        stream.skip(1);
        classname = getClass(classname);
        reader.classref.push({
            classname: classname,
            count: count,
            fields: fields
        });
    }
    function readRef(reader) {
        return reader.refer.read(readInt(reader.stream, Tags.TagSemicolon));
    }

    function Reader(stream, simple, useHarmonyMap) {
        RawReader.call(this, stream);
        this.useHarmonyMap = !!useHarmonyMap;
        Object.defineProperties(this, {
            classref: { value: [] },
            refer: { value: simple ? fakeReaderRefer : realReaderRefer() }
        });
    }

    Reader.prototype = Object.create(RawReader.prototype);
    Reader.prototype.constructor = Reader;

    Object.defineProperties(Reader.prototype, {
        useHarmonyMap: { value: false, writable: true },
        checkTag: { value: function(expectTag, tag) {
            if (tag === undefined) { tag = this.stream.readByte(); }
            if (tag !== expectTag) { unexpectedTag(tag, expectTag); }
        } },
        checkTags: { value: function(expectTags, tag) {
            if (tag === undefined) { tag = this.stream.readByte(); }
            if (expectTags.indexOf(tag) >= 0) { return tag; }
            unexpectedTag(tag, expectTags);
        } },
        unserialize: { value: function() {
            return unserialize(this);
        } },
        readInteger: { value: function() {
            return readInteger(this.stream);
        } },
        readLong: { value: function() {
            return readLong(this.stream);
        } },
        readDouble: { value: function() {
            return readDouble(this.stream);
        } },
        readBoolean: { value: function() {
            return readBoolean(this.stream);
        } },
        readDateWithoutTag: { value: function() {
            return readDateWithoutTag(this);
        } },
        readDate: { value: function() {
            return readDate(this);
        } },
        readTimeWithoutTag: { value: function() {
            return readTimeWithoutTag(this);
        } },
        readTime: { value: function() {
            return readTime(this);
        } },
        readBytesWithoutTag: { value: function() {
            return readBytesWithoutTag(this);
        } },
        readBytes: { value: function() {
            return readBytes(this);
        } },
        readStringWithoutTag: { value: function() {
            return readStringWithoutTag(this);
        } },
        readString: { value: function() {
            return readString(this);
        } },
        readGuidWithoutTag: { value: function() {
            return readGuidWithoutTag(this);
        } },
        readGuid: { value: function() {
            return readGuid(this);
        } },
        readListWithoutTag: { value: function() {
            return readListWithoutTag(this);
        } },
        readList: { value: function() {
            return readList(this);
        } },
        readMapWithoutTag: { value: function() {
            return this.useHarmonyMap ?
                   readHarmonyMapWithoutTag(this) :
                   readMapWithoutTag(this);
        } },
        readMap: { value: function() {
            return this.useHarmonyMap ?
                   readHarmonyMap(this) :
                   readMap(this);
        } },
        readObjectWithoutTag: { value: function() {
            return readObjectWithoutTag(this);
        } },
        readObject: { value: function() {
            return readObject(this);
        } },
        reset: { value: function() {
            this.classref.length = 0;
            this.refer.reset();
        } }
    });

    hprose.Reader = Reader;
})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Formatter.js                                           *
 *                                                        *
 * hprose Formatter for WeChat App.                       *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose) {
    'use strict';
    var BytesIO = hprose.BytesIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;

    function serialize(value, simple) {
        var stream = new BytesIO();
        var writer = new Writer(stream, simple);
        writer.serialize(value);
        return stream;
    }

    function unserialize(stream, simple, useHarmonyMap) {
        if (!(stream instanceof BytesIO)) {
            stream = new BytesIO(stream);
        }
        return new Reader(stream, simple, useHarmonyMap).unserialize();
    }

    hprose.Formatter = {
        serialize: function (value, simple) {
            return serialize(value, simple).bytes;
        },
        unserialize: unserialize
    };

    hprose.serialize = serialize;
    hprose.unserialize = unserialize;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * ResultMode.js                                          *
 *                                                        *
 * hprose ResultMode for WeChat App.                      *
 *                                                        *
 * LastModified: Nov 10, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

hprose.ResultMode = {
    Normal: 0,
    Serialized: 1,
    Raw: 2,
    RawWithEndTag: 3
};
hprose.Normal        = hprose.ResultMode.Normal;
hprose.Serialized    = hprose.ResultMode.Serialized;
hprose.Raw           = hprose.ResultMode.Raw;
hprose.RawWithEndTag = hprose.ResultMode.RawWithEndTag;

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/
/**********************************************************\
 *                                                        *
 * Client.js                                              *
 *                                                        *
 * hprose client for WeChat App.                          *
 *                                                        *
 * LastModified: Apr 24, 2018                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global Proxy */
(function (hprose, undefined) {
    'use strict';
    var setImmediate = hprose.setImmediate;
    var Tags = hprose.Tags;
    var ResultMode = hprose.ResultMode;
    var BytesIO = hprose.BytesIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;
    var Future = hprose.Future;
    var parseuri = hprose.parseuri;
    var isObjectEmpty = hprose.isObjectEmpty;

    var GETFUNCTIONS = new Uint8Array(1);
    GETFUNCTIONS[0] = Tags.TagEnd;

    function noop(){}

    var s_boolean = 'boolean';
    var s_string = 'string';
    var s_number = 'number';
    var s_function = 'function';
    var s_object = 'object';

    function HproseProxy(setFunction, ns) {
        var settings = {};
        this.get = function(target, prop/*, receiver*/) {
            var name = prop.toString();
            if (ns) { name = ns + '_' + name; }
            if (name === 'then') { return undefined; }
            if (!target.hasOwnProperty(name)) {
                settings[name] = {};
                var handler = new HproseProxy(setFunction, name);
                var func = setFunction(settings, name);
                handler.apply = function(target, thisArg, argumentsList) {
                    return func.apply(null, argumentsList);
                }
                handler.set = function(target, prop, value/*, receiver*/) {
                    settings[name][prop] = value;
                    return true;
                };
                target[name] = new Proxy(function() {}, handler);
            }
            return target[name];
        };
    }

    function Client(uri, functions, settings) {

        // private members
        var _uri,
            _uriList                = [],
            _index                  = -1,
            _byref                  = false,
            _simple                 = false,
            _timeout                = 30000,
            _retry                  = 10,
            _idempotent             = false,
            _failswitch             = false,
            _failround              = 0,
            _lock                   = false,
            _tasks                  = [],
            _useHarmonyMap          = false,
            _onerror                = noop,
            _onfailswitch           = noop,
            _filters                = [],
            _batch                  = false,
            _batches                = [],
            _ready                  = new Future(),
            _topics                 = Object.create(null),
            _id                     = null,
            _keepAlive              = true,
            _invokeHandler          = invokeHandler,
            _batchInvokeHandler     = batchInvokeHandler,
            _beforeFilterHandler    = beforeFilterHandler,
            _afterFilterHandler     = afterFilterHandler,
            _invokeHandlers         = [],
            _batchInvokeHandlers    = [],
            _beforeFilterHandlers   = [],
            _afterFilterHandlers    = [],

            self = this;

        function outputFilter(request, context) {
            for (var i = 0, n = _filters.length; i < n; i++) {
                request = _filters[i].outputFilter(request, context);
            }
            return request;
        }

        function inputFilter(response, context) {
            for (var i = _filters.length - 1; i >= 0; i--) {
                response = _filters[i].inputFilter(response, context);
            }
            return response;
        }

        function beforeFilterHandler(request, context) {
            request = outputFilter(request, context);
            return _afterFilterHandler(request, context)
            .then(function(response) {
                if (context.oneway) { return; }
                return inputFilter(response, context);
            });
        }

        function afterFilterHandler(request, context) {
            return self.sendAndReceive(request, context).catchError(function(e) {
                var response = retry(request, context);
                if (response !== null) {
                    return response;
                }
                throw e;
            });
        }

        function sendAndReceive(request, context, onsuccess, onerror) {
            _beforeFilterHandler(request, context).then(onsuccess, onerror);
        }

        function failswitch() {
            var n = _uriList.length;
            if (n > 1) {
                var i = _index + 1;
                if (i >= n) {
                    i = 0;
                    _failround++;
                }
                _index = i;
                _uri = _uriList[_index];
            }
            else {
                _failround++;
            }
            _onfailswitch(self);
        }

        function retry(data, context) {
            if (context.failswitch) {
                failswitch();
            }
            if (context.idempotent && (context.retried < context.retry)) {
                var interval = ++context.retried * 500;
                if (context.failswitch) {
                    interval -= (_uriList.length - 1) * 500;
                }
                if (interval > 5000) {
                    interval = 5000;
                }
                if (interval > 0) {
                    return Future.delayed(interval, function() {
                        return afterFilterHandler(data, context);
                    });
                }
                else {
                    return afterFilterHandler(data, context);
                }
            }
            return null;
        }

        function normalizeFunctions(functions) {
            var root = [Object.create(null)];
            for (var i in functions) {
                var func = functions[i].split('_');
                var n = func.length - 1;
                if (n > 0) {
                    var node = root;
                    for (var j = 0; j < n; j++) {
                        var f = func[j];
                        if (node[0][f] === undefined) {
                            node[0][f] = [Object.create(null)];
                        }
                        node = node[0][f];
                    }
                    node.push(func[n]);
                }
                root.push(functions[i]);
            }
            return root;
        }

        function initService(stub) {
            var context = {
                retry: _retry,
                retried: 0,
                idempotent: true,
                failswitch: true,
                timeout: _timeout,
                client: self,
                userdata: {}
            };
            var onsuccess = function(data) {
                var error = null;
                try {
                    var stream = new BytesIO(data);
                    var reader = new Reader(stream, true);
                    var tag = stream.readByte();
                    switch (tag) {
                        case Tags.TagError:
                            error = new Error(reader.readString());
                            break;
                        case Tags.TagFunctions:
                            var functions = normalizeFunctions(reader.readList());
                            reader.checkTag(Tags.TagEnd);
                            setFunctions(stub, functions);
                            break;
                        default:
                            error = new Error('Wrong Response:\r\n' + BytesIO.toString(data));
                            break;
                    }
                }
                catch (e) {
                    error = e;
                }
                if (error !== null) {
                    _ready.reject(error);
                }
                else {
                    _ready.resolve(stub);
                }
            };
            sendAndReceive(GETFUNCTIONS, context, onsuccess, _ready.reject);
        }

        function setFunction(stub, name) {
            return function() {
                if (_batch) {
                    return _invoke(stub, name, Array.slice(arguments), true);
                }
                else {
                    return Future.all(arguments).then(function(args) {
                        return _invoke(stub, name, args, false);
                    });
                }
            };
        }

        function setMethods(stub, obj, namespace, name, methods) {
            if (obj[name] !== undefined) { return; }
            obj[name] = {};
            if (typeof(methods) === s_string || methods.constructor === Object) {
                methods = [methods];
            }
            if (Array.isArray(methods)) {
                for (var i = 0; i < methods.length; i++) {
                    var m = methods[i];
                    if (typeof(m) === s_string) {
                        obj[name][m] = setFunction(stub, namespace + name + '_' + m);
                    }
                    else {
                        for (var n in m) {
                            setMethods(stub, obj[name], namespace + name + '_', n, m[n]);
                        }
                    }
                }
            }
        }

        function setFunctions(stub, functions) {
            for (var i = 0; i < functions.length; i++) {
                var f = functions[i];
                if (typeof(f) === s_string) {
                    if (stub[f] === undefined) {
                        stub[f] = setFunction(stub, f);
                    }
                }
                else {
                    for (var name in f) {
                        setMethods(stub, stub, '', name, f[name]);
                    }
                }
            }
        }

        function copyargs(src, dest) {
            var n = Math.min(src.length, dest.length);
            for (var i = 0; i < n; ++i) { dest[i] = src[i]; }
        }

        function initContext(batch) {
            if (batch) {
                return {
                    mode: ResultMode.Normal,
                    byref: _byref,
                    simple: _simple,
                    onsuccess: undefined,
                    onerror: undefined,
                    useHarmonyMap: _useHarmonyMap,
                    client: self,
                    userdata: {}
                };
            }
            return {
                mode: ResultMode.Normal,
                byref: _byref,
                simple: _simple,
                timeout: _timeout,
                retry: _retry,
                retried: 0,
                idempotent: _idempotent,
                failswitch: _failswitch,
                oneway: false,
                sync: false,
                onsuccess: undefined,
                onerror: undefined,
                useHarmonyMap: _useHarmonyMap,
                client: self,
                userdata: {}
            };
        }

        function getContext(stub, name, args, batch) {
            var context = initContext(batch);
            if (name in stub) {
                var method = stub[name];
                for (var key in method) {
                    if (key in context) {
                        context[key] = method[key];
                    }
                }
            }
            var i = 0, n = args.length;
            for (; i < n; ++i) {
                if (typeof args[i] === s_function) { break; }
            }
            if (i === n) { return context; }
            var extra = args.splice(i, n - i);
            context.onsuccess = extra[0];
            n = extra.length;
            for (i = 1; i < n; ++i) {
                var arg = extra[i];
                switch (typeof arg) {
                case s_function:
                    context.onerror = arg; break;
                case s_boolean:
                    context.byref = arg; break;
                case s_number:
                    context.mode = arg; break;
                case s_object:
                    for (var k in arg) {
                        if (k in context) {
                            context[k] = arg[k];
                        }
                    }
                    break;
                }
            }
            return context;
        }

        function encode(name, args, context) {
            var stream = new BytesIO();
            stream.writeByte(Tags.TagCall);
            var writer = new Writer(stream, context.simple);
            writer.writeString(name);
            if (args.length > 0 || context.byref) {
                writer.reset();
                writer.writeList(args);
                if (context.byref) {
                    writer.writeBoolean(true);
                }
            }
            return stream;
        }

        function __invoke(name, args, context, batch) {
            if (_lock) {
                return Future.promise(function(resolve, reject) {
                    _tasks.push({
                        batch: batch,
                        name: name,
                        args: args,
                        context: context,
                        resolve: resolve,
                        reject: reject
                    });
                });
            }
            if (batch) {
                return multicall(name, args, context);
            }
            return call(name, args, context);
        }

        function _invoke(stub, name, args, batch) {
            return __invoke(name, args, getContext(stub, name, args, batch), batch);
        }

        function errorHandling(name, error, context, reject) {
            try {
                if (context.onerror) {
                    context.onerror(name, error);
                }
                else {
                    _onerror(name, error);
                }
                reject(error);
            }
            catch (e) {
                reject(e);
            }
        }

        function invokeHandler(name, args, context) {
            var request = encode(name, args, context);
            request.writeByte(Tags.TagEnd);
            return Future.promise(function(resolve, reject) {
                sendAndReceive(request.bytes, context, function(response) {
                    if (context.oneway) {
                        resolve();
                        return;
                    }
                    var result = null;
                    var error = null;
                    try {
                        if (context.mode === ResultMode.RawWithEndTag) {
                            result = response;
                        }
                        else if (context.mode === ResultMode.Raw) {
                            result = response.subarray(0, response.byteLength - 1);
                        }
                        else {
                            var stream = new BytesIO(response);
                            var reader = new Reader(stream, false, context.useHarmonyMap);
                            var tag = stream.readByte();
                            if (tag === Tags.TagResult) {
                                if (context.mode === ResultMode.Serialized) {
                                    result = reader.readRaw();
                                }
                                else {
                                    result = reader.unserialize();
                                }
                                tag = stream.readByte();
                                if (tag === Tags.TagArgument) {
                                    reader.reset();
                                    var _args = reader.readList();
                                    copyargs(_args, args);
                                    tag = stream.readByte();
                                }
                            }
                            else if (tag === Tags.TagError) {
                                error = new Error(reader.readString());
                                tag = stream.readByte();
                            }
                            if (tag !== Tags.TagEnd) {
                                error = new Error('Wrong Response:\r\n' + BytesIO.toString(response));
                            }
                        }
                    }
                    catch (e) {
                        error = e;
                    }
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve(result);
                    }
                }, reject);
            });
        }

        function unlock(sync) {
            return function() {
                if (sync) {
                    _lock = false;
                    setImmediate(function(tasks) {
                        tasks.forEach(function(task) {
                            if ('settings' in task) {
                                endBatch(task.settings)
                                .then(task.resolve, task.reject);
                            }
                            else {
                                __invoke(task.name, task.args, task.context, task.batch).then(task.resolve, task.reject);
                            }
                        });
                    }, _tasks);
                    _tasks = [];
                }
            };
        }

        function call(name, args, context) {
            if (context.sync) { _lock = true; }
            var promise = Future.promise(function(resolve, reject) {
                _invokeHandler(name, args, context).then(function(result) {
                    try {
                        if (context.onsuccess) {
                            try {
                                context.onsuccess(result, args);
                            }
                            catch (e) {
                                if (context.onerror) {
                                    context.onerror(name, e);
                                }
                                reject(e);
                            }
                        }
                        resolve(result);
                    }
                    catch (e) {
                        reject(e);
                    }
                }, function(error) {
                    errorHandling(name, error, context, reject);
                });
            });
            promise.whenComplete(unlock(context.sync));
            return promise;
        }

        function multicall(name, args, context) {
            return Future.promise(function(resolve, reject) {
                _batches.push({
                    args: args,
                    name: name,
                    context: context,
                    resolve: resolve,
                    reject: reject
                });
            });
        }

        function getBatchContext(settings) {
            var context = {
                timeout: _timeout,
                retry: _retry,
                retried: 0,
                idempotent: _idempotent,
                failswitch: _failswitch,
                oneway: false,
                sync: false,
                client: self,
                userdata: {}
            };
            for (var k in settings) {
                if (k in context) {
                    context[k] = settings[k];
                }
            }
            return context;
        }

        function batchInvokeHandler(batches, context) {
            var request = batches.reduce(function(stream, item) {
                stream.write(encode(item.name, item.args, item.context));
                return stream;
            }, new BytesIO());
            request.writeByte(Tags.TagEnd);
            return Future.promise(function(resolve, reject) {
                sendAndReceive(request.bytes, context, function(response) {
                    if (context.oneway) {
                        resolve(batches);
                        return;
                    }
                    var i = -1;
                    var stream = new BytesIO(response);
                    var reader = new Reader(stream, false);
                    var tag = stream.readByte();
                    try {
                        while (tag !== Tags.TagEnd) {
                            var result = null;
                            var error = null;
                            var mode = batches[++i].context.mode;
                            if (mode >= ResultMode.Raw) {
                                result = new BytesIO();
                            }
                            if (tag === Tags.TagResult) {
                                if (mode === ResultMode.Serialized) {
                                    result = reader.readRaw();
                                }
                                else if (mode >= ResultMode.Raw) {
                                    result.writeByte(Tags.TagResult);
                                    result.write(reader.readRaw());
                                }
                                else {
                                    reader.useHarmonyMap = batches[i].context.useHarmonyMap;
                                    reader.reset();
                                    result = reader.unserialize();
                                }
                                tag = stream.readByte();
                                if (tag === Tags.TagArgument) {
                                    if (mode >= ResultMode.Raw) {
                                        result.writeByte(Tags.TagArgument);
                                        result.write(reader.readRaw());
                                    }
                                    else {
                                        reader.reset();
                                        var _args = reader.readList();
                                        copyargs(_args, batches[i].args);
                                    }
                                    tag = stream.readByte();
                                }
                            }
                            else if (tag === Tags.TagError) {
                                if (mode >= ResultMode.Raw) {
                                    result.writeByte(Tags.TagError);
                                    result.write(reader.readRaw());
                                }
                                else {
                                    reader.reset();
                                    error = new Error(reader.readString());
                                }
                                tag = stream.readByte();
                            }
                            if ([Tags.TagEnd,
                                 Tags.TagResult,
                                 Tags.TagError].indexOf(tag) < 0) {
                                reject(new Error('Wrong Response:\r\n' + BytesIO.toString(response)));
                                return;
                            }
                            if (mode >= ResultMode.Raw) {
                                if (mode === ResultMode.RawWithEndTag) {
                                    result.writeByte(Tags.TagEnd);
                                }
                                batches[i].result = result.bytes;
                            }
                            else {
                                batches[i].result = result;
                            }
                            batches[i].error = error;
                        }
                    }
                    catch (e) {
                        reject(e);
                        return;
                    }
                    resolve(batches);
                }, reject);
            });
        }

        function beginBatch() {
            _batch = true;
        }

        function endBatch(settings) {
            settings = settings || {};
            _batch = false;
            if (_lock) {
                return Future.promise(function(resolve, reject) {
                    _tasks.push({
                        batch: true,
                        settings: settings,
                        resolve: resolve,
                        reject: reject
                    });
                });
            }
            var batchSize = _batches.length;
            if (batchSize === 0) { return Future.value([]); }
            var context = getBatchContext(settings);
            if (context.sync) { _lock = true; }
            var batches = _batches;
            _batches = [];
            var promise = Future.promise(function(resolve, reject) {
                _batchInvokeHandler(batches, context).then(function(batches) {
                    batches.forEach(function(i) {
                        if (i.error) {
                            errorHandling(i.name, i.error, i.context, i.reject);
                        }
                        else {
                            try {
                                if (i.context.onsuccess) {
                                    try {
                                        i.context.onsuccess(i.result, i.args);
                                    }
                                    catch (e) {
                                        if (i.context.onerror) {
                                            i.context.onerror(i.name, e);
                                        }
                                        i.reject(e);
                                    }
                                }
                                i.resolve(i.result);
                            }
                            catch (e) {
                                i.reject(e);
                            }
                        }
                        delete i.context;
                        delete i.resolve;
                        delete i.reject;
                    });
                    resolve(batches);
                }, function(error) {
                    batches.forEach(function(i) {
                        if ('reject' in i) {
                            errorHandling(i.name, error, i.context, i.reject);
                        }
                    });
                    reject(error);
                });
            });
            promise.whenComplete(unlock(context.sync));
            return promise;
        }

        function getOnError() {
            return _onerror;
        }
        function setOnError(value) {
            if (typeof(value) === s_function) {
                _onerror = value;
            }
        }
        function getOnFailswitch() {
            return _onfailswitch;
        }
        function setOnFailswitch(value) {
            if (typeof(value) === s_function) {
                _onfailswitch = value;
            }
        }
        function getUri() {
            return _uri;
        }
        function getUriList() {
            return _uriList;
        }
        function setUriList(uriList) {
            if (typeof(uriList) === s_string) {
                _uriList = [uriList];
            }
            else if (Array.isArray(uriList)) {
                _uriList = uriList.slice(0);
                _uriList.sort(function() { return Math.random() - 0.5; });
            }
            else {
                return;
            }
            _index = 0;
            _uri = _uriList[_index];
        }
        function getFailswitch() {
            return _failswitch;
        }
        function setFailswitch(value) {
            _failswitch = !!value;
        }
        function getFailround() {
            return _failround;
        }
        function getTimeout() {
            return _timeout;
        }
        function setTimeout(value) {
            if (typeof(value) === 'number') {
                _timeout = value | 0;
            }
            else {
                _timeout = 0;
            }
        }
        function getRetry() {
            return _retry;
        }
        function setRetry(value) {
            if (typeof(value) === 'number') {
                _retry = value | 0;
            }
            else {
                _retry = 0;
            }
        }
        function getIdempotent() {
            return _idempotent;
        }
        function setIdempotent(value) {
            _idempotent = !!value;
        }
        function setKeepAlive(value) {
            _keepAlive = !!value;
        }
        function getKeepAlive() {
            return _keepAlive;
        }
        function getByRef() {
            return _byref;
        }
        function setByRef(value) {
            _byref = !!value;
        }
        function getSimpleMode() {
            return _simple;
        }
        function setSimpleMode(value) {
            _simple = !!value;
        }
        function getUseHarmonyMap() {
            return _useHarmonyMap;
        }
        function setUseHarmonyMap(value) {
            _useHarmonyMap = !!value;
        }
        function getFilter() {
            if (_filters.length === 0) {
                return null;
            }
            if (_filters.length === 1) {
                return _filters[0];
            }
            return _filters.slice();
        }
        function setFilter(filter) {
            _filters.length = 0;
            if (Array.isArray(filter)) {
                filter.forEach(function(filter) {
                    addFilter(filter);
                });
            }
            else {
                addFilter(filter);
            }
        }
        function addFilter(filter) {
            if (filter &&
                typeof filter.inputFilter === 'function' &&
                typeof filter.outputFilter === 'function') {
                _filters.push(filter);
            }
        }
        function removeFilter(filter) {
            var i = _filters.indexOf(filter);
            if (i === -1) {
                return false;
            }
            _filters.splice(i, 1);
            return true;
        }
        function filters() {
            return _filters;
        }
        function useService(uri, functions, create) {
            if (create === undefined) {
                if (typeof(functions) === s_boolean) {
                    create = functions;
                    functions = false;
                }
                if (!functions) {
                    if (typeof(uri) === s_boolean) {
                        create = uri;
                        uri = false;
                    }
                    else if (uri && uri.constructor === Object ||
                             Array.isArray(uri)) {
                        functions = uri;
                        uri = false;
                    }
                }
            }
            var stub = self;
            if (create) {
                stub = {};
            }
            if (!uri && !_uri) {
                return new Error('You should set server uri first!');
            }
            if (uri) {
                _uri = uri;
            }
            if (typeof(functions) === s_string ||
                (functions && functions.constructor === Object)) {
                functions = [functions];
            }
            if (Array.isArray(functions)) {
                setFunctions(stub, functions);
            }
            else if (typeof(Proxy) === 'undefined') {
                setImmediate(initService, stub);
                return _ready;
            }
            else {
                stub = new Proxy({}, new HproseProxy(setFunction));
            }
            _ready.resolve(stub);
            return stub;
        }
        function invoke(name, args, onsuccess/*, onerror, settings*/) {
            var argc = arguments.length;
            if ((argc < 1) || (typeof name !== s_string)) {
                throw new Error('name must be a string');
            }
            if (argc === 1) { args = []; }
            if (argc === 2) {
                if (!Array.isArray(args)) {
                    var _args = [];
                    if (typeof args !== s_function) {
                        _args.push(noop);
                    }
                    _args.push(args);
                    args = _args;
                }
            }
            if (argc > 2) {
                if (typeof onsuccess !== s_function) {
                    args.push(noop);
                }
                for (var i = 2; i < argc; i++) {
                    args.push(arguments[i]);
                }
            }
            return _invoke(self, name, args, _batch);
        }
        function ready(onComplete, onError) {
            return _ready.then(onComplete, onError);
        }
        function getTopic(name, id) {
            if (_topics[name]) {
                var topics = _topics[name];
                if (topics[id]) {
                    return topics[id];
                }
            }
            return null;
        }
        // subscribe(name, callback, timeout, failswitch)
        // subscribe(name, id, callback, timeout, failswitch)
        function subscribe(name, id, callback, timeout, failswitch) {
            if (typeof name !== s_string) {
                throw new TypeError('topic name must be a string.');
            }
            if (id === undefined || id === null) {
                if (typeof callback === s_function) {
                    id = callback;
                }
                else {
                    throw new TypeError('callback must be a function.');
                }
            }
            if (!_topics[name]) {
                _topics[name] = Object.create(null);
            }
            if (typeof id === s_function) {
                timeout = callback;
                callback = id;
                autoId().then(function(id) {
                    subscribe(name, id, callback, timeout, failswitch);
                });
                return;
            }
            if (typeof callback !== s_function) {
                throw new TypeError('callback must be a function.');
            }
            if (Future.isPromise(id)) {
                id.then(function(id) {
                    subscribe(name, id, callback, timeout, failswitch);
                });
                return;
            }
            // Default subscribe timeout is 5 minutes.
            if (timeout === undefined) { timeout = 300000; }
            var topic = getTopic(name, id);
            if (topic === null) {
                var cb = function() {
                    _invoke(self, name, [id, topic.handler, cb, {
                        idempotent: true,
                        failswitch: failswitch,
                        timeout: timeout
                    }], false);
                };
                topic = {
                    handler: function(result) {
                        var topic = getTopic(name, id);
                        if (topic) {
                            if (result !== null) {
                                var callbacks = topic.callbacks;
                                for (var i = 0, n = callbacks.length; i < n; ++i) {
                                    try {
                                        callbacks[i](result);
                                    }
                                    catch (e) {}
                                }
                            }
                            if (getTopic(name, id) !== null) { cb(); }
                        }
                    },
                    callbacks: [callback]
                };
                _topics[name][id] = topic;
                cb();
            }
            else if (topic.callbacks.indexOf(callback) < 0) {
                topic.callbacks.push(callback);
            }
        }
        function delTopic(topics, id, callback) {
            if (topics) {
                if (typeof callback === s_function) {
                    var topic = topics[id];
                    if (topic) {
                        var callbacks = topic.callbacks;
                        var p = callbacks.indexOf(callback);
                        if (p >= 0) {
                            callbacks[p] = callbacks[callbacks.length - 1];
                            callbacks.length--;
                        }
                        if (callbacks.length === 0) {
                            delete topics[id];
                        }
                    }
                }
                else {
                    delete topics[id];
                }
            }
        }
        // unsubscribe(name)
        // unsubscribe(name, callback)
        // unsubscribe(name, id)
        // unsubscribe(name, id, callback)
        function unsubscribe(name, id, callback) {
            if (typeof name !== s_string) {
                throw new TypeError('topic name must be a string.');
            }
            if (id === undefined || id === null) {
                if (typeof callback === s_function) {
                    id = callback;
                }
                else {
                    delete _topics[name];
                    return;
                }
            }
            if (typeof id === s_function) {
                callback = id;
                id = null;
            }
            if (id === null) {
                if (_id === null) {
                    if (_topics[name]) {
                        var topics = _topics[name];
                        for (id in topics) {
                            delTopic(topics, id, callback);
                        }
                    }
                }
                else {
                    _id.then(function(id) {
                        unsubscribe(name, id, callback);
                    });
                }
            }
            else if (Future.isPromise(id)) {
                id.then(function(id) {
                    unsubscribe(name, id, callback);
                });
            }
            else {
                delTopic(_topics[name], id, callback);
            }
            if (isObjectEmpty(_topics[name])) {
                delete _topics[name];
            }
        }
        function isSubscribed(name) {
            return !!_topics[name];
        }
        function subscribedList() {
            var list = [];
            for (var name in _topics) {
                list.push(name);
            }
            return list;
        }
        function getId() {
            return _id;
        }
        function autoId() {
            if (_id === null) {
                _id = _invoke(self, '#', [], false);
            }
            return _id;
        }
        autoId.sync = true;
        autoId.idempotent = true;
        autoId.failswitch = true;
        function addInvokeHandler(handler) {
            _invokeHandlers.push(handler);
            _invokeHandler = _invokeHandlers.reduceRight(
            function(next, handler) {
                return function(name, args, context) {
                    return Future.toPromise(handler(name, args, context, next));
                };
            }, invokeHandler);
        }
        function addBatchInvokeHandler(handler) {
            _batchInvokeHandlers.push(handler);
            _batchInvokeHandler = _batchInvokeHandlers.reduceRight(
            function(next, handler) {
                return function(batches, context) {
                    return Future.toPromise(handler(batches, context, next));
                };
            }, batchInvokeHandler);
        }
        function addBeforeFilterHandler(handler) {
            _beforeFilterHandlers.push(handler);
            _beforeFilterHandler = _beforeFilterHandlers.reduceRight(
            function(next, handler) {
                return function(request, context) {
                    return Future.toPromise(handler(request, context, next));
                };
            }, beforeFilterHandler);
        }
        function addAfterFilterHandler(handler) {
            _afterFilterHandlers.push(handler);
            _afterFilterHandler = _afterFilterHandlers.reduceRight(
            function(next, handler) {
                return function(request, context) {
                    return Future.toPromise(handler(request, context, next));
                };
            }, afterFilterHandler);
        }
        function use(handler) {
            addInvokeHandler(handler);
            return self;
        }
        var batch = Object.create(null, {
            begin: { value: beginBatch },
            end: { value: endBatch },
            use: { value: function(handler) {
                addBatchInvokeHandler(handler);
                return batch;
            } }
        });
        var beforeFilter = Object.create(null, {
            use: { value: function(handler) {
                addBeforeFilterHandler(handler);
                return beforeFilter;
            } }
        });
        var afterFilter = Object.create(null, {
            use: { value: function(handler) {
                addAfterFilterHandler(handler);
                return afterFilter;
            } }
        });
        Object.defineProperties(this, {
            '#': { value: autoId },
            onerror: { get: getOnError, set: setOnError },
            onfailswitch: { get: getOnFailswitch, set: setOnFailswitch },
            uri: { get: getUri },
            uriList: { get: getUriList, set: setUriList },
            id: { get: getId },
            failswitch: { get: getFailswitch, set: setFailswitch },
            failround: { get: getFailround },
            timeout: { get: getTimeout, set: setTimeout },
            retry: { get: getRetry, set: setRetry },
            idempotent: { get: getIdempotent, set: setIdempotent },
            keepAlive: { get: getKeepAlive, set: setKeepAlive },
            byref: { get: getByRef, set: setByRef },
            simple: { get: getSimpleMode, set: setSimpleMode },
            useHarmonyMap: { get: getUseHarmonyMap, set: setUseHarmonyMap },
            filter: { get: getFilter, set: setFilter },
            addFilter: { value: addFilter },
            removeFilter: { value: removeFilter },
            filters: { get: filters },
            useService: { value: useService },
            invoke: { value: invoke },
            ready: { value: ready },
            subscribe: { value: subscribe },
            unsubscribe: { value: unsubscribe },
            isSubscribed: { value : isSubscribed },
            subscribedList: { value : subscribedList },
            use: { value: use },
            batch: { value: batch },
            beforeFilter: { value: beforeFilter },
            afterFilter: { value: afterFilter }
        });
        /* function constructor */ {
            if ((settings) && (typeof settings === s_object)) {
                ['failswitch', 'timeout', 'retry', 'idempotent',
                 'keepAlive', 'byref', 'simple','useHarmonyMap',
                 'filter'].forEach(function(key) {
                     if (key in settings) {
                         self[key] = settings[key];
                     }
                });
            }
            if (uri) {
                setUriList(uri);
                useService(functions);
            }
        }
    }

    function checkuri(uri) {
        var parser = parseuri(uri);
        var protocol = parser.protocol;
        if (protocol === 'http:' ||
            protocol === 'https:' ||
            protocol === 'ws:' ||
            protocol === 'wss:') {
            return;
        }
        throw new Error('The ' + protocol + ' client isn\'t implemented.');
    }

    function create(uri, functions, settings) {
        try {
            return hprose.HttpClient.create(uri, functions, settings);
        }
        catch(e) {}
        try {
            return hprose.WebSocketClient.create(uri, functions, settings);
        }
        catch(e) {}
        if (typeof uri === 'string') {
            checkuri(uri);
        }
        else if (Array.isArray(uri)) {
            uri.forEach(function(uri) { checkuri(uri); });
            throw new Error('Not support multiple protocol.');
        }
        throw new Error('You should set server uri first!');
    }

    Object.defineProperty(Client, 'create', { value: create });

    hprose.Client = Client;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/
/**********************************************************\
 *                                                        *
 * HttpClient.js                                          *
 *                                                        *
 * hprose http client for WeChat App.                     *
 *                                                        *
 * LastModified: Dec 2, 2016                              *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global wx */
(function (hprose) {
    'use strict';
    var Client = hprose.Client;
    var Future = hprose.Future;
    var parseuri = hprose.parseuri;
    var BytesIO = hprose.BytesIO;

    function HttpClient(uri, functions, settings) {
        if (this.constructor !== HttpClient) {
            return new HttpClient(uri, functions, settings);
        }
        Client.call(this, uri, functions, settings);
        var _header = Object.create(null);

        var self = this;

        function getRequestHeader(headers) {
            var header = {};
            var name, value;
            for (name in _header) {
                header[name] = _header[name];
            }
            if (headers) {
                for (name in headers) {
                    value = headers[name];
                    if (Array.isArray(value)) {
                        header[name] = value.join(', ');
                    }
                    else {
                        header[name] = value;
                    }
                }
            }
            return header;
        }

        function wxPost(request, context) {
            var future = new Future();
            var header = getRequestHeader(context.httpHeader);
            header['Content-Type'] = 'text/plain; charset=UTF-8';
            wx.request({
                url: self.uri,
                method: 'POST',
                data: BytesIO.toString(request),
                header: header,
                timeout: context.timeout,
                complete: function(ret) {
                    if (typeof ret.statusCode === "undefined") {
                        future.reject(new Error(ret.errMsg));
                    }
                    else if (parseInt(ret.statusCode, 10) === 200) {
                        future.resolve(new BytesIO(ret.data).takeBytes());
                    }
                    else {
                        future.reject(new Error(ret.statusCode + ":" + ret.data));
                    }
                }
            });
            return future; 
        }

        function sendAndReceive(request, context) {
            var future = wxPost(request, context);
            if (context.oneway) { future.resolve(); }
            return future;
        }

        function setHeader(name, value) {
            if (name.toLowerCase() !== 'content-type') {
                if (value) {
                    _header[name] = value;
                }
                else {
                    delete _header[name];
                }
            }
        }
        Object.defineProperties(this, {
            setHeader: { value: setHeader },
            sendAndReceive: { value: sendAndReceive }
        });
    }

    function checkuri(uri) {
        var parser = parseuri(uri);
        if (parser.protocol === 'http:' || parser.protocol === 'https:') {
            return;
        }
        throw new Error('This client desn\'t support ' + parser.protocol + ' scheme.');
    }

    function create(uri, functions, settings) {
        if (typeof uri === 'string') {
            checkuri(uri);
        }
        else if (Array.isArray(uri)) {
            uri.forEach(function(uri) { checkuri(uri); });
        }
        else {
            throw new Error('You should set server uri first!');
        }
        return new HttpClient(uri, functions, settings);
    }

    Object.defineProperties(HttpClient, {
        create: { value: create }
    });

    hprose.HttpClient = HttpClient;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/
/**********************************************************\
 *                                                        *
 * WebSocketClient.js                                     *
 *                                                        *
 * hprose websocket client for WeChat App.                *
 *                                                        *
 * LastModified: Aug 20, 2017                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global wx */
(function (hprose, undefined) {
    'use strict';

    var BytesIO = hprose.BytesIO;
    var Client = hprose.Client;
    var Future = hprose.Future;
    var parseuri = hprose.parseuri;

    var OPENING = 1;
    var OPENED  = 2;
    var CLOSING = 3;
    var CLOSED  = 4;

    function noop(){}
    function WebSocketClient(uri, functions, settings) {
        if (this.constructor !== WebSocketClient) {
            return new WebSocketClient(uri, functions, settings);
        }

        Client.call(this, uri, functions, settings);

        var _id = 0;
        var _count = 0;
        var _futures = [];
        var _requests = [];
        var _ready = null;
        var ws = CLOSED;

        var self = this;

        function getNextId() {
            return (_id < 0x7fffffff) ? ++_id : _id = 0;
        }
        function send(id, request) {
            var bytes = new BytesIO();
            bytes.writeInt32BE(id);
            if (request.constructor === String) {
                bytes.writeString(request);
            }
            else {
                bytes.write(request);
            }
            var message = bytes.bytes;
            wx.sendSocketMessage({
                data: message.buffer.slice(0, message.length)
            });
        }
        function onopen() {
            ws = OPENED;
            _ready.resolve();
        }
        function onmessage(e) {
            var bytes = new BytesIO(e.data);
            var id = bytes.readInt32BE();
            var future = _futures[id];
            delete _futures[id];
            if (future !== undefined) {
                --_count;
                future.resolve(bytes.read(bytes.length - 4));
            }
            if ((_count < 100) && (_requests.length > 0)) {
                ++_count;
                var request = _requests.pop();
                _ready.then(function() { send(request[0], request[1]); });
            }
            if (_count === 0 && !self.keepAlive) {
                close();
            }
        }
        function onerror(e) {
            if (!e || e.message === "") {
                return;
            }
            ws = CLOSING;
            _futures.forEach(function(future, id) {
                future.reject(new Error("websocket can't open"));
                delete _futures[id];
            });
            _count = 0;
            ws = CLOSED;
        }
        function onclose() {
            ws = CLOSING;
            _futures.forEach(function(future, id) {
                future.reject(new Error("websocket closed"));
                delete _futures[id];
            });
            _count = 0;
            ws = CLOSED;
        }
        function connect() {
            ws = OPENING;
            _ready = new Future();
            wx.connectSocket({url: self.uri});
            wx.onSocketOpen(onopen);
            wx.onSocketMessage(onmessage);
            wx.onSocketError(onerror);
            wx.onSocketClose(onclose);
        }
        function sendAndReceive(request, context) {
            var id = getNextId();
            var future = new Future();
            _futures[id] = future;
            if (context.timeout > 0) {
                future = future.timeout(context.timeout).catchError(function(e) {
                    delete _futures[id];
                    --_count;
                    close();
                    throw e;
                },
                function(e) {
                    return e instanceof TimeoutError;
                });
            }
            if (ws === CLOSING || ws === CLOSED) {
                connect();
            }
            if (_count < 100) {
                ++_count;
                _ready.then(function() { send(id, request); });
            }
            else {
                _requests.push([id, request]);
            }
            if (context.oneway) { future.resolve(); }
            return future;
        }
        function close() {
            if (ws !== CLOSING && ws !== CLOSED) {
                ws = CLOSING;
                wx.onSocketOpen(noop);
                wx.onSocketMessage(noop);
                wx.onSocketError(noop);
                wx.onSocketClose(noop);
                wx.closeSocket();
            }
        }

        Object.defineProperties(this, {
            sendAndReceive: { value: sendAndReceive },
            close: { value: close }
        });
    }

    function checkuri(uri) {
        var parser = parseuri(uri);
        if (parser.protocol === 'ws:' ||
            parser.protocol === 'wss:') {
            return;
        }
        throw new Error('This client desn\'t support ' + parser.protocol + ' scheme.');
    }

    function create(uri, functions, settings) {
        if (typeof uri === 'string') {
            checkuri(uri);
        }
        else if (Array.isArray(uri)) {
            uri.forEach(function(uri) { checkuri(uri); });
        }
        else {
            throw new Error('You should set server uri first!');
        }
        return new WebSocketClient(uri, functions, settings);
    }

    Object.defineProperty(WebSocketClient, 'create', { value: create });

    hprose.WebSocketClient = WebSocketClient;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * JSONRPCClientFilter.js                                 *
 *                                                        *
 * jsonrpc client filter for WeChat App.                  *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

/* global JSON */
(function (hprose) {
    'use strict';
    var Tags = hprose.Tags;
    var BytesIO = hprose.BytesIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;

    var s_id = 1;

    function JSONRPCClientFilter(version) {
        this.version = version || '2.0';
    }

    JSONRPCClientFilter.prototype.inputFilter = function inputFilter(data/*, context*/) {
        var json = BytesIO.toString(data);
        if (json.charAt(0) === '{') {
            json = '[' + json + ']';
        }
        var responses = JSON.parse(json);
        var stream = new BytesIO();
        var writer = new Writer(stream, true);
        for (var i = 0, n = responses.length; i < n; ++i) {
            var response = responses[i];
            if (response.error) {
                stream.writeByte(Tags.TagError);
                writer.writeString(response.error.message);
            }
            else {
                stream.writeByte(Tags.TagResult);
                writer.serialize(response.result);
            }
        }
        stream.writeByte(Tags.TagEnd);
        return stream.bytes;
    };

    JSONRPCClientFilter.prototype.outputFilter = function outputFilter(data/*, context*/) {
        var requests = [];
        var stream = new BytesIO(data);
        var reader = new Reader(stream, false, false);
        var tag = stream.readByte();
        do {
            var request = {};
            if (tag === Tags.TagCall) {
                request.method = reader.readString();
                tag = stream.readByte();
                if (tag === Tags.TagList) {
                    request.params = reader.readListWithoutTag();
                    tag = stream.readByte();
                }
                if (tag === Tags.TagTrue) {
                    tag = stream.readByte();
                }
            }
            if (this.version === '1.1') {
                request.version = '1.1';
            }
            else if (this.version === '2.0') {
                request.jsonrpc = '2.0';
            }
            request.id = s_id++;
            requests.push(request);
        } while (tag === Tags.TagCall);
        if (requests.length > 1) {
            return JSON.stringify(requests);
        }
        return JSON.stringify(requests[0]);
    };

    hprose.JSONRPCClientFilter = JSONRPCClientFilter;

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/
/**********************************************************\
 *                                                        *
 * wx.js                                                  *
 *                                                        *
 * hprose.wx for WeChat App.                              *
 *                                                        *
 * LastModified: Nov 18, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function(hprose) {

    var Future = hprose.Future;

    function promisify_wx(name) {
        return function(args) {
            args = args || {};
            var future = new Future();
            try {
                args.success = future.resolve;
                args.fail = future.reject;
                wx[name](args);
            }
            catch (e) {
                future.reject(e);
            }
            return future;
        }
    }

    var exclusionList = [
        'invoke',
        'showNavigationBarLoading',
        'hideNavigationBarLoading',
        'navigateBack',
        'drawCanvas',
        'canvasToTempFilePath',
        'hideKeyboard',
        'getPublicLibVersion'
    ];

    hprose.wx = {};

    for (var name in wx) {
        if (typeof wx[name] === 'function' &&
            exclusionList.indexOf(name) < 0 &&
            name.search(/(^(on|create|stop|pause))|((Sync)$)/) < 0) {
            hprose.wx[name] = promisify_wx(name); 
        }
        else {
            hprose.wx[name] = wx[name];
        }
    }

})(hprose);

/**********************************************************\
|                                                          |
|                          hprose                          |
|                                                          |
| Official WebSite: http://www.hprose.com/                 |
|                   http://www.hprose.org/                 |
|                                                          |
\**********************************************************/

/**********************************************************\
 *                                                        *
 * Loader.js                                              *
 *                                                        *
 * hprose loader for WeChat App.                          *
 *                                                        *
 * LastModified: Nov 17, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

hprose.common = {
    Completer: hprose.Completer,
    Future: hprose.Future,
    ResultMode: hprose.ResultMode
};

hprose.io = {
    BytesIO: hprose.BytesIO,
    ClassManager: hprose.ClassManager,
    Tags: hprose.Tags,
    RawReader: hprose.RawReader,
    Reader: hprose.Reader,
    Writer: hprose.Writer,
    Formatter: hprose.Formatter
};

hprose.client = {
    Client: hprose.Client,
    HttpClient: hprose.HttpClient,
    WebSocketClient: hprose.WebSocketClient
};

hprose.filter = {
    JSONRPCClientFilter: hprose.JSONRPCClientFilter
};

/* global module */
module.exports = hprose;
