var Proxy  = require('./proxy');
var config = require('../sepia-config');

var MAIN_SERVER    = config['mainServer']
var API_URL_REGEX  = /api\//;
var RAILS_PORT     = config['APIServers']['rails']['port'];
var SEPIA_PORT     = config['sepia']['port'];
var EMBER_CLI_PORT = config['emberCLI']['port'];

var MasterProxy = Proxy.extend({
  name: 'Master Proxy',
  port: MAIN_SERVER['port'],
  proxyOptions: MAIN_SERVER['proxyOptions'],

  buildProxyTarget: function (request) {
    var protocol = 'http://';
    var host = request.headers.host;
    var port = API_URL_REGEX.test(request.url) ? SEPIA_PORT : EMBER_CLI_PORT;
    var url = protocol + host;
    var fullURL = this.replacePort(url, port);
    return fullURL;
  }
});

module.exports = MasterProxy;
