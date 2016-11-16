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
