var Ows4js = {};

Ows4js.version = '0.1.2';

Ows4js.Ows = {};
Ows4js.Fes = {};

Ows4js.Proxy = '/cgi-bin/proxy.cgi?url=';
Ows4js.Util = {};

/**
 * Util functions
 * */

Ows4js.Util.httpGet = function(url) {
    var httpRequest;
    try {
        try {
            httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
        } catch (e) {
            httpRequest = new XMLHttpRequest();
        }
        httpRequest.open('GET', url, false);
        httpRequest.send(null);
        return httpRequest;
    } catch (e) {
        throw e;
    }
};

Ows4js.Util.httpPost = function(url, lang, request, async) {
    return new Promise(function(fulfill, reject){
        var httpRequest = new XMLHttpRequest();
        httpRequest.onreadystatechange=function() {
            if (httpRequest.readyState==4 && httpRequest.status==200) {
                console.log(request);
                fulfill(httpRequest.responseXML);
            }
        };
        httpRequest.open('POST', url, true);
        httpRequest.setRequestHeader('Accept-Language',lang);
        httpRequest.send(request);
    });
};

Ows4js.Util.buildUrl = function(url, params) {
    var kvps = [];

    for (var key in params) {
        if (params[key] !== null) {
            kvps.push(key+'='+params[key]);
        }
    }
    return url + '?' + kvps.join('&');
};