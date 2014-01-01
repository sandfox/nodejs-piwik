var PiwikClient, querystring, urltool;

urltool = require('url');

querystring = require('querystring');

PiwikClient = (function() {
  var url, _ref, _ref1;

  function PiwikClient(baseURL, token) {}

  url = urltool.parse(baseURL, true);

  PiwikClient.settings = {};

  switch (url.protocol) {
    case 'http:':
      PiwikClient.http = require('http');
      ((_ref = PiwikClient.settings.apiport) != null ? _ref : url.port) || 80;
      break;
    case 'https:':
      PiwikClient.http = require('https');
      ((_ref1 = PiwikClient.settings.apiport) != null ? _ref1 : url.port) || 443;
  }

  if (url.query && url.query.token_auth) {
    PiwikClient.settings.token = url.query.token_auth;
  }

  if (token) {
    PiwikClient.settings.token = token;
  }

  PiwikClient.settings.apihost = url.hostname;

  PiwikClient.settings.apipath = url.pathname;

  return PiwikClient;

})();

({
  api: function(vars, cb) {
    var _ref;
    if (typeof vars !== 'object') {
      vars = {};
    }
    vars.module = 'API';
    vars.format = 'JSON';
    if ((_ref = vars.token_auth) == null) {
      vars.token_auth = this.settings.token;
    }
    return this.http.get({
      host: this.settings.apihost,
      port: this.settings.apiport,
      path: this.settings.apipath + '?' + querystring.stringify(vars)
    }, function(response) {
      var data;
      data = '';
      response.on('data', function(chunk) {
        return data += chunk;
      });
      return response.on('end', function() {
        var resObj;
        try {
          resObj = JSON.parse(data);
          if (resObj.result === 'error') {
            return cb(resObj.message, null);
          }
          return cb(null, resObj);
        } catch (error) {
          return cb(error.message, null);
        }
      });
    });
  }
});

module.exports = PiwikClient;
