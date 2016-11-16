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
