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
            var header = Object.create(null);
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
