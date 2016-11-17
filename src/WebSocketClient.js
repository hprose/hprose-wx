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
 * LastModified: Nov 17, 2016                             *
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
        function sendAndReceive(request, env) {
            var id = getNextId();
            var future = new Future();
            _futures[id] = future;
            if (env.timeout > 0) {
                future = future.timeout(env.timeout).catchError(function(e) {
                    delete _futures[id];
                    --_count;
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
            if (env.oneway) { future.resolve(); }
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
