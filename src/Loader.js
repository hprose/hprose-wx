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
