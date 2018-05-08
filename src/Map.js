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
