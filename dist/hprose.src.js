// Hprose for WeChat App v2.0.0
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
 * LastModified: Nov 10, 2016                             *
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
 * LastModified: Nov 16, 2016                             *
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

    hprose.parseuri = function(url) {
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
    };

    hprose.isObjectEmpty = function (obj) {
        if (obj) {
            var prop;
            for (prop in obj) {
                return false;
            }
        }
        return true;
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
 * LastModified: Nov 16, 2016                             *
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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var PENDING = 0;
    var FULFILLED = 1;
    var REJECTED = 2;

    var setImmediate = hprose.setImmediate;

    function Future(computation) {
        var self = this;
        Object.defineProperties(self, {
            _subscribers: { value: [] },
            resolve: { value: this.resolve.bind(self) },
            reject: { value: this.reject.bind(self) }
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
        Array.forEach(array, function() { ++size; });
        return size;
    }

    function all(array) {
        array = isPromise(array) ? array : value(array);
        return array.then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            var result = new Array(n);
            if (count === 0) { return value(result); }
            var future = new Future();
            Array.forEach(array, function(element, index) {
                toPromise(element).then(function(value) {
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
        array = isPromise(array) ? array : value(array);
        return array.then(function(array) {
            var future = new Future();
            Array.forEach(array, function(element) {
                toPromise(element).fill(future);
            });
            return future;
        });
    }

    function any(array) {
        array = isPromise(array) ? array : value(array);
        return array.then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            if (count === 0) {
                throw new RangeError('any(): array must not be empty');
            }
            var reasons = new Array(n);
            var future = new Future();
            Array.forEach(array, function(element, index) {
                toPromise(element).then(future.resolve, function(e) {
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
        array = isPromise(array) ? array : value(array);
        return array.then(function(array) {
            var n = array.length;
            var count = arraysize(array);
            var result = new Array(n);
            if (count === 0) { return value(result); }
            var future = new Future();
            Array.forEach(array, function(element, index) {
                var f = toPromise(element);
                f.whenComplete(function() {
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
        var args = Array.slice(arguments, 1);
        return all(args).then(function(args) {
            return handler.apply(thisArg, args);
        });
    }

    function run(handler, thisArg/*, arg1, arg2, ... */) {
        var args = Array.slice(arguments, 2);
        return all(args).then(function(args) {
            return handler.apply(thisArg, args);
        });
    }

    function isGenerator(obj) {
        return 'function' == typeof obj.next && 'function' == typeof obj.throw;
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

    function thunkToPromise(fn) {
        var thisArg = (function() { return this; })();
        var future = new Future();
        fn.call(thisArg, function(err, res) {
            if (arguments.length < 2) {
                if (err instanceof Error) {
                    return future.reject(err);
                }
                return future.resolve(err);
            }
            if (err) return future.reject(err);
            if (arguments.length > 2) {
                res = Array.slice(arguments, 1);
            }
            future.resolve(res);
        });
        return future;
    }

    function thunkify(fn) {
        return function() {
            var args = Array.slice(arguments, 0);
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
            var args = Array.slice(arguments, 0);
            var results = new Future();
            args.push(function(err, res) {
                if (arguments.length < 2) {
                    if (err instanceof Error) {
                        return results.reject(err);
                    }
                    return results.resolve(err);
                }
                if (err) return results.reject(err);
                if (arguments.length > 2) {
                    res = Array.slice(arguments, 1);
                }
                results.resolve(res);
            });
            try {
                fn.apply(this, args);
            }
            catch (err) {
                results.reject(err);
            }
            return results;
        };
    }

    function toPromise(obj) {
        if (!obj) return value(obj);
        if (isPromise(obj)) return obj;
        if (isGeneratorFunction(obj) || isGenerator(obj)) return co(obj);
        if ('function' == typeof obj) return thunkToPromise(obj);
        return value(obj);
    }

    function co(gen) {
        var thisArg = (function() { return this; })();
        if (typeof gen === 'function') {
            var args = Array.slice(arguments, 1);
            gen = gen.apply(thisArg, args);
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
                next(gen.throw(err));
            }
            catch (e) {
                return future.reject(e);
            }
        }

        function next(ret) {
            if (ret.done) {
                future.resolve(ret.value);
            }
            else {
                toPromise(ret.value).then(onFulfilled, onRejected);
            }
        }

        if (!gen || typeof gen.next !== 'function') {
            return future.resolve(gen);
        }
        onFulfilled();

        return future;
    }

    function wrap(handler, thisArg) {
        return function() {
            thisArg = thisArg || this;
            return all(arguments).then(function(args) {
                var result = handler.apply(thisArg, args);
                if (isGeneratorFunction(result)) {
                    return co.call(thisArg, result);
                }
                return result;
            });
        };
    }

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
                if (!isPromise(initialValue)) {
                    initialValue = value(initialValue);
                }
                return initialValue.then(function(value) {
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
                if (!isPromise(initialValue)) {
                    initialValue = value(initialValue);
                }
                return initialValue.then(function(value) {
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
            if (!isPromise(searchElement)) {
                searchElement = value(searchElement);
            }
            return searchElement.then(function(searchElement) {
                return array.indexOf(searchElement, fromIndex);
            });
        });
    }

    function lastIndexOf(array, searchElement, fromIndex) {
        return all(array).then(function(array) {
            if (!isPromise(searchElement)) {
                searchElement = value(searchElement);
            }
            return searchElement.then(function(searchElement) {
                if (fromIndex === undefined) {
                    fromIndex = array.length - 1;
                }
                return array.lastIndexOf(searchElement, fromIndex);
            });
        });
    }

    function includes(array, searchElement, fromIndex) {
        return all(array).then(function(array) {
            if (!isPromise(searchElement)) {
                searchElement = value(searchElement);
            }
            return searchElement.then(function(searchElement) {
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
            var args = Array.slice(arguments, 1);
            return this.then(function(result) {
                return all(args).then(function(args) {
                    return result[method].apply(result, args);
                });
            });
        } },
        bind: { value: function(method) {
            var bindargs = Array.slice(arguments);
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
                var args = Array.slice(arguments);
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
 * StringIO.js                                            *
 *                                                        *
 * hprose StringIO for WeChat App.                        *
 *                                                        *
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    // i is a int32 number
    function int32BE(i) {
        return String.fromCharCode(
            i >>> 24 & 0xFF,
            i >>> 16 & 0xFF,
            i >>> 8  & 0xFF,
            i        & 0xFF
        );
    }

    // i is a int32 number
    function int32LE(i) {
        return String.fromCharCode(
            i        & 0xFF,
            i >>> 8  & 0xFF,
            i >>> 16 & 0xFF,
            i >>> 24 & 0xFF
        );
    }

    // s is an UTF16 encode string
    function utf8Encode(s) {
        var buf = [];
        var n = s.length;
        for (var i = 0, j = 0; i < n; ++i, ++j) {
            var codeUnit = s.charCodeAt(i);
            if (codeUnit < 0x80) {
                buf[j] = s.charAt(i);
            }
            else if (codeUnit < 0x800) {
                buf[j] = String.fromCharCode(0xC0 | (codeUnit >> 6),
                                             0x80 | (codeUnit & 0x3F));
            }
            else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
                buf[j] = String.fromCharCode(0xE0 | (codeUnit >> 12),
                                             0x80 | ((codeUnit >> 6) & 0x3F),
                                             0x80 | (codeUnit & 0x3F));
            }
            else {
                if (i + 1 < n) {
                    var nextCodeUnit = s.charCodeAt(i + 1);
                    if (codeUnit < 0xDC00 && 0xDC00 <= nextCodeUnit && nextCodeUnit <= 0xDFFF) {
                        var rune = (((codeUnit & 0x03FF) << 10) | (nextCodeUnit & 0x03FF)) + 0x010000;
                        buf[j] = String.fromCharCode(0xF0 | ((rune >> 18) &0x3F),
                                                     0x80 | ((rune >> 12) & 0x3F),
                                                     0x80 | ((rune >> 6) & 0x3F),
                                                     0x80 | (rune & 0x3F));
                        ++i;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        return buf.join('');
    }

    function readShortString(bs, n) {
        var charCodes = new Array(n);
        var i = 0, off = 0;
        for (var len = bs.length; i < n && off < len; i++) {
            var unit = bs.charCodeAt(off++);
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
                                    (bs.charCodeAt(off++) & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (off + 1 < len) {
                    charCodes[i] = ((unit & 0x0F) << 12) |
                                   ((bs.charCodeAt(off++) & 0x3F) << 6) |
                                   (bs.charCodeAt(off++) & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (off + 2 < len) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bs.charCodeAt(off++) & 0x3F) << 12) |
                                ((bs.charCodeAt(off++) & 0x3F) << 6) |
                                (bs.charCodeAt(off++) & 0x3F)) - 0x10000;
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

    function readLongString(bs, n) {
        var buf = [];
        var charCodes = new Array(0x8000);
        var i = 0, off = 0;
        for (var len = bs.length; i < n && off < len; i++) {
            var unit = bs.charCodeAt(off++);
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
                                    (bs.charCodeAt(off++) & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (off + 1 < len) {
                    charCodes[i] = ((unit & 0x0F) << 12) |
                                   ((bs.charCodeAt(off++) & 0x3F) << 6) |
                                   (bs.charCodeAt(off++) & 0x3F);
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (off + 2 < len) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bs.charCodeAt(off++) & 0x3F) << 12) |
                                ((bs.charCodeAt(off++) & 0x3F) << 6) |
                                (bs.charCodeAt(off++) & 0x3F)) - 0x10000;
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
                buf[buf.length] = String.fromCharCode.apply(String, charCodes);
                n -= size;
                i = -1;
            }
        }
        if (i > 0) {
            charCodes.length = i;
            buf[buf.length] = String.fromCharCode.apply(String, charCodes);
        }
        return [buf.join(''), off];
    }

    // bs is an UTF8 encode binary string
    // n is UTF16 length
    function readString(bs, n) {
        if (n === undefined || n === null || (n < 0)) { n = bs.length; }
        if (n === 0) { return ['', 0]; }
        return ((n < 0xFFFF) ?
                readShortString(bs, n) :
                readLongString(bs, n));
    }

    // bs is an UTF8 encode binary string
    // n is UTF16 length
    function readUTF8(bs, n) {
        if (n === undefined || n === null || (n < 0)) { n = bs.length; }
        if (n === 0) { return ''; }
        var i = 0, off = 0;
        for (var len = bs.length; i < n && off < len; i++) {
            var unit = bs.charCodeAt(off++);
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
                    ++off;
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
                                ((bs.charCodeAt(off++) & 0x3F) << 12) |
                                ((bs.charCodeAt(off++) & 0x3F) << 6) |
                                (bs.charCodeAt(off++) & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        break;
                    }
                    throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            default:
                throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        return bs.substr(0, off);
    }

    // bs is an UTF8 encode binary string
    function utf8Decode(bs) {
        return readString(bs)[0];
    }

    // s is an UTF16 encode string
    function utf8Length(s) {
        var n = s.length;
        var length = 0;
        for (var i = 0; i < n; ++i) {
            var codeUnit = s.charCodeAt(i);
            if (codeUnit < 0x80) {
                ++length;
            }
            else if (codeUnit < 0x800) {
                length += 2;
            }
            else if (codeUnit < 0xD800 || codeUnit > 0xDFFF) {
                length += 3;
            }
            else {
                if (i + 1 < n) {
                    var nextCodeUnit = s.charCodeAt(i + 1);
                    if (codeUnit < 0xDC00 && 0xDC00 <= nextCodeUnit && nextCodeUnit <= 0xDFFF) {
                        ++i;
                        length += 4;
                        continue;
                    }
                }
                throw new Error('Malformed string');
            }
        }
        return length;
    }

    // bs is an UTF8 encode binary string
    function utf16Length(bs) {
        var n = bs.length;
        var length = 0;
        for (var i = 0; i < n; ++i, ++length) {
            var unit = bs.charCodeAt(i);
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
                if (i < n) {
                    ++i;
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 14:
                if (i + 1 < n) {
                    i += 2;
                    break;
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            case 15:
                if (i + 2 < n) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bs.charCodeAt(i++) & 0x3F) << 12) |
                                ((bs.charCodeAt(i++) & 0x3F) << 6) |
                                (bs.charCodeAt(i++) & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        ++length;
                        break;
                    }
                    throw new Error('Character outside valid Unicode range: 0x' + rune.toString(16));
                }
                throw new Error('Unfinished UTF-8 octet sequence');
            default:
                throw new Error('Bad UTF-8 encoding 0x' + unit.toString(16));
            }
        }
        return length;
    }

    function isUTF8(bs) {
        for (var i = 0, n = bs.length; i < n; ++i) {
            var unit = bs.charCodeAt(i);
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
                if (i < n) {
                    ++i;
                    break;
                }
                return false;
            case 14:
                if (i + 1 < n) {
                    i += 2;
                    break;
                }
                return false;
            case 15:
                if (i + 2 < n) {
                    var rune = (((unit & 0x07) << 18) |
                                ((bs.charCodeAt(i++) & 0x3F) << 12) |
                                ((bs.charCodeAt(i++) & 0x3F) << 6) |
                                (bs.charCodeAt(i++) & 0x3F)) - 0x10000;
                    if (0 <= rune && rune <= 0xFFFFF) {
                        break;
                    }
                }
                return false;
            default:
                return false;
            }
        }
        return true;
    }

    function StringIO() {
        var a = arguments;
        switch (a.length) {
        case 1:
            this._buffer = [a[0].toString()];
            break;
        case 2:
            this._buffer = [a[0].toString().substr(a[1])];
            break;
        case 3:
            this._buffer = [a[0].toString().substr(a[1], a[2])];
            break;
        default:
            this._buffer = [''];
            break;
        }
        this.mark();
    }

    Object.defineProperties(StringIO.prototype, {
        _buffer: { writable: true },
        _off: { value: 0, writable: true },
        _wmark: { writable: true },
        _rmark: { writable: true },
        toString: { value: function() {
            if (this._buffer.length > 1) {
                this._buffer = [this._buffer.join('')];
            }
            return this._buffer[0];
        } },
        length: { get: function() {
            return this.toString().length;
        } },
        position: { get: function() {
            return this._off;
        } },
        mark: { value: function() {
            this._wmark = this.length;
            this._rmark = this._off;
        } },
        reset: { value: function() {
            this._buffer = [this.toString().substr(0, this._wmark)];
            this._off = this._rmark;
        } },
        clear: { value: function() {
            this._buffer = [''];
            this._wmark = 0;
            this._off = 0;
            this._rmark = 0;
        } },
        writeByte: { value: function(b) {
            this._buffer.push(String.fromCharCode(b & 0xFF));
        } },
        writeInt32BE: { value: function(i) {
            if ((i === (i | 0)) && (i <= 2147483647)) {
                this._buffer.push(int32BE(i));
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeUInt32BE: { value: function(i) {
            if (((i & 0x7FFFFFFF) + 0x80000000 === i) && (i >= 0)) {
                this._buffer.push(int32BE(i | 0));
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeInt32LE: { value: function(i) {
            if ((i === (i | 0)) && (i <= 2147483647)) {
                this._buffer.push(int32LE(i));
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeUInt32LE: { value: function(i) {
            if (((i & 0x7FFFFFFF) + 0x80000000 === i) && (i >= 0)) {
                this._buffer.push(int32LE(i | 0));
                return;
            }
            throw new TypeError('value is out of bounds');
        } },
        writeUTF16AsUTF8: { value: function(str) {
            this._buffer.push(utf8Encode(str));
        } },
        writeUTF8AsUTF16: { value: function(str) {
            this._buffer.push(utf8Decode(str));
        } },
        write: { value: function(data) {
            this._buffer.push(data);
        } },
        readByte: { value: function() {
            if (this._off < this.length) {
                return this._buffer[0].charCodeAt(this._off++);
            }
            return -1;
        } },
        readChar: { value: function() {
            if (this._off < this.length) {
                return this._buffer[0].charAt(this._off++);
            }
            return '';
        } },
        readInt32BE: { value: function() {
            var len = this.length;
            var buf = this._buffer[0];
            var off = this._off;
            if (off + 3 < len) {
                var result = buf.charCodeAt(off++) << 24 |
                             buf.charCodeAt(off++) << 16 |
                             buf.charCodeAt(off++) << 8  |
                             buf.charCodeAt(off++);
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
            var len = this.length;
            var buf = this._buffer[0];
            var off = this._off;
            if (off + 3 < len) {
                var result = buf.charCodeAt(off++)       |
                             buf.charCodeAt(off++) << 8  |
                             buf.charCodeAt(off++) << 16 |
                             buf.charCodeAt(off++) << 24;
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
            var off = this._off;
            var len = this.length;
            if (off + n > len) {
                n = len - off;
            }
            if (n === 0) { return ''; }
            this._off = off + n;
            return this._buffer[0].substring(off, this._off);
        } },
        skip: { value: function(n) {
            var len = this.length;
            if (this._off + n > len) {
                n = len - this._off;
                this._off = len;
            }
            else {
                this._off += n;
            }
            return n;
        } },
        // the result is an String, and includes tag.
        readString: { value: function(tag) {
            var len = this.length;
            var off = this._off;
            var buf = this._buffer[0];
            var pos = buf.indexOf(tag, off);
            if (pos === -1) {
                buf = buf.substr(off);
                this._off = len;
            }
            else {
                buf = buf.substring(off, pos + 1);
                this._off = pos + 1;
            }
            return buf;
        } },
        // the result is a String, and doesn't include tag.
        // but the position is the same as readString
        readUntil: { value: function(tag) {
            var len = this.length;
            var off = this._off;
            var buf = this._buffer[0];
            var pos = buf.indexOf(tag, off);
            if (pos === this._off) {
                buf = '';
                this._off++;
            }
            else if (pos === -1) {
                buf = buf.substr(off);
                this._off = len;
            }
            else {
                buf = buf.substring(off, pos);
                this._off = pos + 1;
            }
            return buf;
        } },
        // n is the UTF16 length
        readUTF8: { value: function(n) {
            var len = this.length;
            var r = readUTF8(this._buffer[0].substring(this._off, Math.min(this._off + n * 3, len)), n);
            this._off += r.length;
            return r;
        } },
        // n is the UTF16 length
        readUTF8AsUTF16: { value: function(n) {
            var len = this.length;
            var r = readString(this._buffer[0].substring(this._off, Math.min(this._off + n * 3, len)), n);
            this._off += r[1];
            return r[0];
        } },
        // n is also the UTF16 length
        readUTF16AsUTF8: { value: function(n) {
            return utf8Encode(this.read(n));
        } },
        // returns a view of the the internal buffer and clears `this`.
        take: { value: function() {
            var buffer = this.toString();
            this.clear();
            return buffer;
        } },
        clone: { value: function() {
            return new StringIO(this.toString());
        } },
        trunc: { value: function() {
            var buf = this.toString().substring(this._off, this._length);
            this._buffer[0] = buf;
            this._off = 0;
            this._wmark = 0;
            this._rmark = 0;
        } }
    });

    Object.defineProperties(StringIO, {
        utf8Encode: { value: utf8Encode },
        utf8Decode: { value: utf8Decode },
        utf8Length: { value: utf8Length },
        utf16Length: { value: utf16Length },
        isUTF8: { value: isUTF8 }
    });

    hprose.StringIO = StringIO;

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
 * LastModified: Nov 10, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

hprose.Tags = {
    /* Serialize Tags */
    TagInteger      : 'i',
    TagLong         : 'l',
    TagDouble       : 'd',
    TagNull         : 'n',
    TagEmpty        : 'e',
    TagTrue         : 't',
    TagFalse        : 'f',
    TagNaN          : 'N',
    TagInfinity     : 'I',
    TagDate         : 'D',
    TagTime         : 'T',
    TagUTC          : 'Z',
    TagBytes        : 'b', // This tag is not supported for WeChat App.
    TagUTF8Char     : 'u',
    TagString       : 's',
    TagGuid         : 'g',
    TagList         : 'a',
    TagMap          : 'm',
    TagClass        : 'c',
    TagObject       : 'o',
    TagRef          : 'r',
    /* Serialize Marks */
    TagPos          : '+',
    TagNeg          : '-',
    TagSemicolon    : ';',
    TagOpenbrace    : '{',
    TagClosebrace   : '}',
    TagQuote        : '"',
    TagPoint        : '.',
    /* Protocol Tags */
    TagFunctions    : 'F',
    TagCall         : 'C',
    TagResult       : 'R',
    TagArgument     : 'A',
    TagError        : 'E',
    TagEnd          : 'z'
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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var StringIO = hprose.StringIO;
    var Tags = hprose.Tags;
    var ClassManager = hprose.ClassManager;
    var utf8Encode = StringIO.utf8Encode;
    var Map = hprose.Map;

    function getClassName(obj) {
        var cls = obj.constructor;
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
                this._stream.write(Tags.TagRef);
                this._stream.write(index);
                this._stream.write(Tags.TagSemicolon);
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
        if (value === undefined ||
            value === null ||
            value.constructor === Function) {
            stream.write(Tags.TagNull);
            return;
        }
        if (value === '') {
            stream.write(Tags.TagEmpty);
            return;
        }
        switch (value.constructor) {
        case Number:
            writeNumber(writer, value);
            break;
        case Boolean:
            writeBoolean(writer, value);
            break;
        case String:
            if (value.length === 1) {
                stream.write(Tags.TagUTF8Char);
                stream.write(value);
            }
            else {
                writer.writeStringWithRef(value);
            }
            break;
        case Date:
            writer.writeDateWithRef(value);
            break;
        case Map:
            writer.writeMapWithRef(value);
            break;
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
                stream.write(n);
            }
            else {
                stream.write(Tags.TagInteger);
                stream.write(n);
                stream.write(Tags.TagSemicolon);
            }
        }
        else {
            writeDouble(writer, n);
        }
    }

    function writeInteger(writer, n) {
        var stream = writer.stream;
        if (0 <= n && n <= 9) {
            stream.write(n);
        }
        else {
            if (n < -2147483648 || n > 2147483647) {
                stream.write(Tags.TagLong);
            }
            else {
                stream.write(Tags.TagInteger);
            }
            stream.write(n);
            stream.write(Tags.TagSemicolon);
        }
    }

    function writeDouble(writer, n) {
        var stream = writer.stream;
        if (n !== n) {
            stream.write(Tags.TagNaN);
        }
        else if (n !== Infinity && n !== -Infinity) {
            stream.write(Tags.TagDouble);
            stream.write(n);
            stream.write(Tags.TagSemicolon);
        }
        else {
            stream.write(Tags.TagInfinity);
            stream.write((n > 0) ? Tags.TagPos : Tags.TagNeg);
        }
    }

    function writeBoolean(writer, b) {
        writer.stream.write(b.valueOf() ? Tags.TagTrue : Tags.TagFalse);
    }

    function writeUTCDate(writer, date) {
        writer._refer.set(date);
        var stream = writer.stream;
        stream.write(Tags.TagDate);
        stream.write(('0000' + date.getUTCFullYear()).slice(-4));
        stream.write(('00' + (date.getUTCMonth() + 1)).slice(-2));
        stream.write(('00' + date.getUTCDate()).slice(-2));
        stream.write(Tags.TagTime);
        stream.write(('00' + date.getUTCHours()).slice(-2));
        stream.write(('00' + date.getUTCMinutes()).slice(-2));
        stream.write(('00' + date.getUTCSeconds()).slice(-2));
        var millisecond = date.getUTCMilliseconds();
        if (millisecond !== 0) {
            stream.write(Tags.TagPoint);
            stream.write(('000' + millisecond).slice(-3));
        }
        stream.write(Tags.TagUTC);
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
            stream.write(Tags.TagDate);
            stream.write(year);
            stream.write(month);
            stream.write(day);
        }
        else if ((year === '1970') && (month === '01') && (day === '01')) {
            stream.write(Tags.TagTime);
            stream.write(hour);
            stream.write(minute);
            stream.write(second);
            if (millisecond !== '000') {
                stream.write(Tags.TagPoint);
                stream.write(millisecond);
            }
        }
        else {
            stream.write(Tags.TagDate);
            stream.write(year);
            stream.write(month);
            stream.write(day);
            stream.write(Tags.TagTime);
            stream.write(hour);
            stream.write(minute);
            stream.write(second);
            if (millisecond !== '000') {
                stream.write(Tags.TagPoint);
                stream.write(millisecond);
            }
        }
        stream.write(Tags.TagSemicolon);
    }

    function writeTime(writer, time) {
        writer._refer.set(time);
        var stream = writer.stream;
        var hour = ('00' + time.getHours()).slice(-2);
        var minute = ('00' + time.getMinutes()).slice(-2);
        var second = ('00' + time.getSeconds()).slice(-2);
        var millisecond = ('000' + time.getMilliseconds()).slice(-3);
        stream.write(Tags.TagTime);
        stream.write(hour);
        stream.write(minute);
        stream.write(second);
        if (millisecond !== '000') {
            stream.write(Tags.TagPoint);
            stream.write(millisecond);
        }
        stream.write(Tags.TagSemicolon);
    }

    function writeString(writer, str) {
        writer._refer.set(str);
        var stream = writer.stream;
        var n = str.length;
        stream.write(Tags.TagString);
        if (n > 0) {
            stream.write(n);
            stream.write(Tags.TagQuote);
            stream.write(str);
        }
        else {
            stream.write(Tags.TagQuote);
        }
        stream.write(Tags.TagQuote);
    }

    function writeList(writer, array) {
        writer._refer.set(array);
        var stream = writer.stream;
        var n = array.length;
        stream.write(Tags.TagList);
        if (n > 0) {
            stream.write(n);
            stream.write(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                serialize(writer, array[i]);
            }
        }
        else {
            stream.write(Tags.TagOpenbrace);
        }
        stream.write(Tags.TagClosebrace);
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
        stream.write(Tags.TagMap);
        if (n > 0) {
            stream.write(n);
            stream.write(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                serialize(writer, fields[i]);
                serialize(writer, map[fields[i]]);
            }
        }
        else {
            stream.write(Tags.TagOpenbrace);
        }
        stream.write(Tags.TagClosebrace);
    }

    function writeHarmonyMap(writer, map) {
        writer._refer.set(map);
        var stream = writer.stream;
        var n = map.size;
        stream.write(Tags.TagMap);
        if (n > 0) {
            stream.write(n);
            stream.write(Tags.TagOpenbrace);
            map.forEach(function(value, key) {
                serialize(writer, key);
                serialize(writer, value);
            });
        }
        else {
            stream.write(Tags.TagOpenbrace);
        }
        stream.write(Tags.TagClosebrace);
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
        stream.write(Tags.TagObject);
        stream.write(index);
        stream.write(Tags.TagOpenbrace);
        writer._refer.set(obj);
        var n = fields.length;
        for (var i = 0; i < n; i++) {
            serialize(writer, obj[fields[i]]);
        }
        stream.write(Tags.TagClosebrace);
    }

    function writeClass(writer, classname, fields) {
        var stream = writer.stream;
        var n = fields.length;
        stream.write(Tags.TagClass);
        stream.write(classname.length);
        stream.write(Tags.TagQuote);
        stream.write(classname);
        stream.write(Tags.TagQuote);
        if (n > 0) {
            stream.write(n);
            stream.write(Tags.TagOpenbrace);
            for (var i = 0; i < n; i++) {
                writeString(writer, fields[i]);
            }
        }
        else {
            stream.write(Tags.TagOpenbrace);
        }
        stream.write(Tags.TagClosebrace);
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
        writeString: { value: function(value) {
            writeString(this, value);
        } },
        writeStringWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeString(this, value);
            }
        } },
        writeList: { value: function(value) {
            writeList(this, value);
        } },
        writeListWithRef: { value: function(value) {
            if (!this._refer.write(value)) {
                writeList(this, value);
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
                this.writeMap(value);
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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var StringIO = hprose.StringIO;
    var Tags = hprose.Tags;
    var ClassManager = hprose.ClassManager;
    var Map = hprose.Map;

    function unexpectedTag(tag, expectTags) {
        if (tag && expectTags) {
            throw new Error('Tag "' + expectTags + '" expected, but "' + tag + '" found in stream');
        }
        if (tag) {
            throw new Error('Unexpected serialize tag "' + tag + '" in stream');
        }
        throw new Error('No byte found in stream');
    }

    function readRaw(stream) {
        var ostream = new StringIO();
        _readRaw(stream, ostream);
        return ostream.take();
    }

    function _readRaw(stream, ostream) {
        __readRaw(stream, ostream, stream.readChar());
    }

    function __readRaw(stream, ostream, tag) {
        ostream.write(tag);
        switch (tag) {
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case Tags.TagNull:
            case Tags.TagEmpty:
            case Tags.TagTrue:
            case Tags.TagFalse:
            case Tags.TagNaN:
                break;
            case Tags.TagInfinity:
                ostream.write(stream.read());
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
            tag = stream.read();
            ostream.write(tag);
        } while (tag !== Tags.TagSemicolon);
    }

    function readDateTimeRaw(stream, ostream) {
        var tag;
        do {
            tag = stream.read();
            ostream.write(tag);
        } while (tag !== Tags.TagSemicolon &&
                 tag !== Tags.TagUTC);
    }

    function readUTF8CharRaw(stream, ostream) {
        ostream.write(stream.readChar());
    }

    function readStringRaw(stream, ostream) {
        var s = stream.readUntil(Tags.TagQuote);
        ostream.write(s);
        ostream.write(Tags.TagQuote);
        var count = 0;
        if (s.length > 0) {
            count = parseInt(s, 10);
        }
        ostream.write(stream.read(count + 1));
    }

    function readGuidRaw(stream, ostream) {
        ostream.write(stream.read(38));
    }

    function readComplexRaw(stream, ostream) {
        var tag;
        do {
            tag = stream.readChar();
            ostream.write(tag);
        } while (tag !== Tags.TagOpenbrace);
        while ((tag = stream.readChar()) !== Tags.TagClosebrace) {
            __readRaw(stream, ostream, tag);
        }
        ostream.write(tag);
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

    function getter(str) {
        var obj = global;
        var names = str.split('.');
        var i;
        for (i = 0; i < names.length; i++) {
            obj = obj[names[i]];
            if (obj === undefined) {
                return null;
            }
        }
        return obj;
    }
    function findClass(cn, poslist, i, c) {
        if (i < poslist.length) {
            var pos = poslist[i];
            cn[pos] = c;
            var cls = findClass(cn, poslist, i + 1, '.');
            if (i + 1 < poslist.length) {
                if (cls === null) {
                    cls = findClass(cn, poslist, i + 1, '_');
                }
            }
            return cls;
        }
        var classname = cn.join('');
        try {
            var cl = getter(classname);
            return ((typeof(cl) === 'function') ? cl : null);
        } catch (e) {
            return null;
        }
    }

    function getClass(classname) {
        var cls = ClassManager.getClass(classname);
        if (cls) { return cls; }
        cls = getter(classname);
        if (typeof(cls) === 'function') {
            ClassManager.register(cls, classname);
            return cls;
        }
        var poslist = [];
        var pos = classname.indexOf('_');
        while (pos >= 0) {
            poslist[poslist.length] = pos;
            pos = classname.indexOf('_', pos + 1);
        }
        if (poslist.length > 0) {
            var cn = classname.split('');
            cls = findClass(cn, poslist, 0, '.');
            if (cls === null) {
                cls = findClass(cn, poslist, 0, '_');
            }
            if (typeof(cls) === 'function') {
                ClassManager.register(cls, classname);
                return cls;
            }
        }
        cls = function () {};
        Object.defineProperties(cls.prototype, {
            'getClassName': { value: function () {
                return classname;
            } }
        });
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
        var tag = stream.readChar();
        switch (tag) {
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
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
        var tag = stream.readChar();
        switch (tag) {
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
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
        var tag = stream.readChar();
        switch (tag) {
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case Tags.TagInteger:
            case Tags.TagLong: return readLongWithoutTag(stream);
            default: unexpectedTag(tag);
        }
    }
    function readDoubleWithoutTag(stream) {
        return parseFloat(stream.readUntil(Tags.TagSemicolon));
    }
    function readDouble(stream) {
        var tag = stream.readChar();
        switch (tag) {
            case '0': return 0;
            case '1': return 1;
            case '2': return 2;
            case '3': return 3;
            case '4': return 4;
            case '5': return 5;
            case '6': return 6;
            case '7': return 7;
            case '8': return 8;
            case '9': return 9;
            case Tags.TagInteger:
            case Tags.TagLong:
            case Tags.TagDouble: return readDoubleWithoutTag(stream);
            case Tags.TagNaN: return NaN;
            case Tags.TagInfinity: return readInfinityWithoutTag(stream);
            default: unexpectedTag(tag);
        }
    }
    function readInfinityWithoutTag(stream) {
        return ((stream.readChar() === Tags.TagNeg) ? -Infinity : Infinity);
    }
    function readBoolean(stream) {
        var tag = stream.readChar();
        switch (tag) {
            case Tags.TagTrue: return true;
            case Tags.TagFalse: return false;
            default: unexpectedTag(tag);
        }
    }
    function readDateWithoutTag(reader) {
        var stream = reader.stream;
        var year = parseInt(stream.read(4), 10);
        var month = parseInt(stream.read(2), 10) - 1;
        var day = parseInt(stream.read(2), 10);
        var date;
        var tag = stream.readChar();
        if (tag === Tags.TagTime) {
            var hour = parseInt(stream.read(2), 10);
            var minute = parseInt(stream.read(2), 10);
            var second = parseInt(stream.read(2), 10);
            var millisecond = 0;
            tag = stream.readChar();
            if (tag === Tags.TagPoint) {
                millisecond = parseInt(stream.read(3), 10);
                tag = stream.readChar();
                if ((tag >= '0') && (tag <= '9')) {
                    stream.skip(2);
                    tag = stream.readChar();
                    if ((tag >= '0') && (tag <= '9')) {
                        stream.skip(2);
                        tag = stream.readChar();
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
        var tag = reader.stream.readChar();
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
        var hour = parseInt(stream.read(2), 10);
        var minute = parseInt(stream.read(2), 10);
        var second = parseInt(stream.read(2), 10);
        var millisecond = 0;
        var tag = stream.readChar();
        if (tag === Tags.TagPoint) {
            millisecond = parseInt(stream.read(3), 10);
            tag = stream.readChar();
            if ((tag >= '0') && (tag <= '9')) {
                stream.skip(2);
                tag = stream.readChar();
                if ((tag >= '0') && (tag <= '9')) {
                    stream.skip(2);
                    tag = stream.readChar();
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
        var tag = reader.stream.readChar();
        switch (tag) {
            case Tags.TagNull: return null;
            case Tags.TagTime: return readTimeWithoutTag(reader);
            case Tags.TagRef: return readRef(reader);
            default: unexpectedTag(tag);
        }
    }
    function readUTF8CharWithoutTag(reader) {
        return reader.stream.read(1);
    }
    function _readString(reader) {
        var stream = reader.stream;
        var count = readInt(stream, Tags.TagQuote);
        var s = stream.read(count);
        stream.skip(1);
        return s;
    }
    function readStringWithoutTag(reader) {
        var s = _readString(reader);
        reader.refer.set(s);
        return s;
    }
    function readString(reader) {
        var tag = reader.stream.readChar();
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
        var s = stream.read(36);
        stream.skip(1);
        reader.refer.set(s);
        return s;
    }
    function readGuid(reader) {
        var tag = reader.stream.readChar();
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
        var tag = reader.stream.readChar();
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
        var tag = reader.stream.readChar();
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
        var tag = reader.stream.readChar();
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
        var tag = reader.stream.readChar();
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
            if (tag === undefined) { tag = this.stream.readChar(); }
            if (tag !== expectTag) { unexpectedTag(tag, expectTag); }
        } },
        checkTags: { value: function(expectTags, tag) {
            if (tag === undefined) { tag = this.stream.readChar(); }
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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose) {
    'use strict';
    var StringIO = hprose.StringIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;

    function serialize(value, simple) {
        var stream = new StringIO();
        var writer = new Writer(stream, simple);
        writer.serialize(value);
        return stream.take();
    }

    function unserialize(stream, simple, useHarmonyMap) {
        if (!(stream instanceof StringIO)) {
            stream = new StringIO(stream);
        }
        return new Reader(stream, simple, useHarmonyMap).unserialize();
    }

    hprose.Formatter = Object.create(null, {
        serialize: { value: serialize },
        unserialize: { value: unserialize }
    });

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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose, undefined) {
    'use strict';
    var setImmediate = hprose.setImmediate;
    var Tags = hprose.Tags;
    var ResultMode = hprose.ResultMode;
    var StringIO = hprose.StringIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;
    var Future = hprose.Future;
    var parseuri = hprose.parseuri;
    var isObjectEmpty = hprose.isObjectEmpty;
    var Map = hprose.Map;

    var GETFUNCTIONS = Tags.TagEnd;

    function noop(){}

    var s_boolean = 'boolean';
    var s_string = 'string';
    var s_number = 'number';
    var s_function = 'function';
    var s_object = 'object';

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
            if (typeof self.onfailswitch === s_function) {
                self.onfailswitch(self);
            }
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
                    var stream = new StringIO(data);
                    var reader = new Reader(stream, true);
                    var tag = stream.readChar();
                    switch (tag) {
                        case Tags.TagError:
                            error = new Error(reader.readString());
                            break;
                        case Tags.TagFunctions:
                            var functions = reader.readList();
                            reader.checkTag(Tags.TagEnd);
                            setFunctions(stub, functions);
                            break;
                        default:
                            error = new Error('Wrong Response:\r\n' + data);
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
                            setMethods(stub, obj[name], name + '_', n, m[n]);
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
            var stream = new StringIO();
            stream.write(Tags.TagCall);
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
                else if (self.onerror) {
                    self.onerror(name, error);
                }
                reject(error);
            }
            catch (e) {
                reject(e);
            }
        }

        function invokeHandler(name, args, context) {
            var request = encode(name, args, context);
            request.write(Tags.TagEnd);
            return Future.promise(function(resolve, reject) {
                sendAndReceive(request.toString(), context, function(response) {
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
                            result = response.substring(0, response.length - 1);
                        }
                        else {
                            var stream = new StringIO(response);
                            var reader = new Reader(stream, false, context.useHarmonyMap);
                            var tag = stream.readChar();
                            if (tag === Tags.TagResult) {
                                if (context.mode === ResultMode.Serialized) {
                                    result = reader.readRaw();
                                }
                                else {
                                    result = reader.unserialize();
                                }
                                tag = stream.readChar();
                                if (tag === Tags.TagArgument) {
                                    reader.reset();
                                    var _args = reader.readList();
                                    copyargs(_args, args);
                                    tag = stream.readChar();
                                }
                            }
                            else if (tag === Tags.TagError) {
                                error = new Error(reader.readString());
                                tag = stream.readChar();
                            }
                            if (tag !== Tags.TagEnd) {
                                error = new Error('Wrong Response:\r\n' + response);
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
            }, new StringIO());
            request.write(Tags.TagEnd);
            return Future.promise(function(resolve, reject) {
                sendAndReceive(request.toString(), context, function(response) {
                    if (context.oneway) {
                        resolve(batches);
                        return;
                    }
                    var i = -1;
                    var stream = new StringIO(response);
                    var reader = new Reader(stream, false, false);
                    var tag = stream.readChar();
                    try {
                        while (tag !== Tags.TagEnd) {
                            var result = null;
                            var error = null;
                            var mode = batches[++i].context.mode;
                            if (mode >= ResultMode.Raw) {
                                result = new StringIO();
                            }
                            if (tag === Tags.TagResult) {
                                if (mode === ResultMode.Serialized) {
                                    result = reader.readRaw();
                                }
                                else if (mode >= ResultMode.Raw) {
                                    result.write(Tags.TagResult);
                                    result.write(reader.readRaw());
                                }
                                else {
                                    reader.useHarmonyMap = batches[i].context.useHarmonyMap;
                                    reader.reset();
                                    result = reader.unserialize();
                                }
                                tag = stream.readChar();
                                if (tag === Tags.TagArgument) {
                                    if (mode >= ResultMode.Raw) {
                                        result.write(Tags.TagArgument);
                                        result.write(reader.readRaw());
                                    }
                                    else {
                                        reader.reset();
                                        var _args = reader.readList();
                                        copyargs(_args, batches[i].args);
                                    }
                                    tag = stream.readChar();
                                }
                            }
                            else if (tag === Tags.TagError) {
                                if (mode >= ResultMode.Raw) {
                                    result.write(Tags.TagError);
                                    result.write(reader.readRaw());
                                }
                                else {
                                    reader.reset();
                                    error = new Error(reader.readString());
                                }
                                tag = stream.readChar();
                            }
                            if ([Tags.TagEnd,
                                 Tags.TagResult,
                                 Tags.TagError].indexOf(tag) < 0) {
                                reject(new Error('Wrong Response:\r\n' + response));
                                return;
                            }
                            if (mode >= ResultMode.Raw) {
                                if (mode === ResultMode.RawWithEndTag) {
                                    result.write(Tags.TagEnd);
                                }
                                batches[i].result = result.toString();
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
        function _setTimeout(value) {
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
            if (!Array.isArray(functions)) {
                setImmediate(initService, stub);
                return _ready;
            }
            setFunctions(stub, functions);
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
            if (timeout === undefined) { timeout = _timeout; }
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
                    return Future.sync(function() {
                        return handler(name, args, context, next);
                    });
                };
            }, invokeHandler);
        }
        function addBatchInvokeHandler(handler) {
            _batchInvokeHandlers.push(handler);
            _batchInvokeHandler = _batchInvokeHandlers.reduceRight(
            function(next, handler) {
                return function(batches, context) {
                    return Future.sync(function() {
                        return handler(batches, context, next);
                    });
                };
            }, batchInvokeHandler);
        }
        function addBeforeFilterHandler(handler) {
            _beforeFilterHandlers.push(handler);
            _beforeFilterHandler = _beforeFilterHandlers.reduceRight(
            function(next, handler) {
                return function(request, context) {
                    return Future.sync(function() {
                        return handler(request, context, next);
                    });
                };
            }, beforeFilterHandler);
        }
        function addAfterFilterHandler(handler) {
            _afterFilterHandlers.push(handler);
            _afterFilterHandler = _afterFilterHandlers.reduceRight(
            function(next, handler) {
                return function(request, context) {
                    return Future.sync(function() {
                        return handler(request, context, next);
                    });
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
            onerror: { value: null, writable: true },
            onfailswitch: { value: null, writable: true },
            uri: { get: getUri },
            uriList: { get: getUriList, set: setUriList },
            id: { get: getId },
            failswitch: { get: getFailswitch, set: setFailswitch },
            failround: { get: getFailround },
            timeout: { get: getTimeout, set: _setTimeout },
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
                         self[key](settings[key]);
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
        if (protocol === 'http:' || protocol === 'https:') {
            return;
        }
        throw new Error('The ' + protocol + ' client isn\'t implemented.');
    }

    function create(uri, functions, settings) {
        try {
            return hprose.HttpClient.create(uri, functions, settings);
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

    Object.defineProperties(Client, {
        create: { value: create }
    });

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
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose) {
    'use strict';
    var Client = hprose.Client;
    var Future = hprose.Future;
    var parseuri = hprose.parseuri;

    function HttpClient(uri, functions, settings) {
        if (this.constructor !== HttpClient) {
            return new HttpClient(uri, functions, settings);
        }
        Client.call(this, uri, functions, settings);
        var _header = Object.create(null);

        var self = this;

        function wxPost(request, env) {
            var future = new Future();
            var header = {};
            for (var k in _header) {
                header[k] = _header[k];
            }
            header['Content-Type'] = 'text/plain; charset=UTF-8';
            wx.request({
                url: self.uri,
                method: 'POST',
                data: request,
                header: header,
                timeout: env.timeout,
                complete: function(ret) {
                    if (parseInt(ret.statusCode, 10) === 200) {
                        future.resolve(ret.data);
                    }
                    else {
                        future.reject(new Error(ret.statusCode + ":" + ret.data));
                    }
                }
            });
            return future; 
        }

        function sendAndReceive(request, env) {
            var future = wxPost(request, env);
            if (env.oneway) { future.resolve(); }
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
 * JSONRPCClientFilter.js                                 *
 *                                                        *
 * jsonrpc client filter for WeChat App.                  *
 *                                                        *
 * LastModified: Nov 16, 2016                             *
 * Author: Ma Bingyao <andot@hprose.com>                  *
 *                                                        *
\**********************************************************/

(function (hprose) {
    'use strict';
    var Tags = hprose.Tags;
    var StringIO = hprose.StringIO;
    var Writer = hprose.Writer;
    var Reader = hprose.Reader;

    var s_id = 1;

    function JSONRPCClientFilter(version) {
        this.version = version || '2.0';
    }

    JSONRPCClientFilter.prototype.inputFilter = function inputFilter(data/*, context*/) {
        if (data.charAt(0) === '{') {
            data = '[' + data + ']';
        }
        var responses = JSON.parse(data);
        var stream = new StringIO();
        var writer = new Writer(stream, true);
        for (var i = 0, n = responses.length; i < n; ++i) {
            var response = responses[i];
            if (response.error) {
                stream.write(Tags.TagError);
                writer.writeString(response.error.message);
            }
            else {
                stream.write(Tags.TagResult);
                writer.serialize(response.result);
            }
        }
        stream.write(Tags.TagEnd);
        return stream.take();
    };

    JSONRPCClientFilter.prototype.outputFilter = function outputFilter(data/*, context*/) {
        var requests = [];
        var stream = new StringIO(data);
        var reader = new Reader(stream, false, false);
        var tag = stream.readChar();
        do {
            var request = {};
            if (tag === Tags.TagCall) {
                request.method = reader.readString();
                tag = stream.readChar();
                if (tag === Tags.TagList) {
                    request.params = reader.readListWithoutTag();
                    tag = stream.readChar();
                }
                if (tag === Tags.TagTrue) {
                    tag = stream.readChar();
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
 * Loader.js                                              *
 *                                                        *
 * hprose loader for WeChat App.                          *
 *                                                        *
 * LastModified: Nov 10, 2016                             *
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
    TcpClient: hprose.TcpClient,
    WebSocketClient: hprose.WebSocketClient
};

hprose.filter = {
    JSONRPCClientFilter: hprose.JSONRPCClientFilter
};

module.exports = hprose;
