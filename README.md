nodejs-piwik
============

This a [node.js](http://nodejs.org/) module to access a Piwik API.

## Installation

```shell
npm install piwik-client
```

## Usage

```js
var PiwikClient = require('piwik-client');
var myClient = new PiwikClient('https://example.tld/index.php', 'abcd1234' )

myClient.api({
  method:   'Actions.getPageUrls',
  idSite:   1,
  period:   'day',
  date:     'today'
}, (err, responseObject) {
	//Code etc etc
});
```


`new PiwikClient(baseUrl, [token])` - Returns a new PiwikClient
* `baseURL` - required - The URL to your Piwik installation. Both HTTP and HTTPS are supported.
* `token` - optional - Your API access token. Either set *token* or include *token_auth* in the *baseURL*.





`PiwikClient#api({options}, callback)` - Gets or sets data. Check out the [Piwik API Reference](http://piwik.org/docs/analytics-api/reference/) for methods.
* `options.method` - required - The method you want to call.
* `options.everything-else` - optional - Dependent on the method your calling
* `callback` - required - Will be called upon error or successful call, first arg is null unless there was an error, second contains parsed JSON response from piwik.


