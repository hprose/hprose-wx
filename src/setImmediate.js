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
