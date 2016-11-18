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
