var Proxy  = require('../models/proxy');
var config = require('../../config/sepia');

var API_URL_REGEX  = /api\//;
var MAIN_SERVER    = config['main'];
var SEPIA_PORT     = config['sepia']['port'];
var EMBER_CLI_PORT = config['emberCLI']['port'];

var MasterProxy = Proxy.extend({
  name: 'Master Proxy',
  port: MAIN_SERVER['port'],
  proxyOptions: MAIN_SERVER['proxyOptions'],
  emberPort: EMBER_CLI_PORT,
  sepiaPort: SEPIA_PORT,

  buildProxyTarget: function (request) {
    var protocol = 'http://';
    var host = request.headers.host;
    var port = API_URL_REGEX.test(request.url) ? this.sepiaPort : this.emberPort;
    var url = protocol + host;
    var fullURL = this.replacePort(url, port);
    return fullURL;
  }
});

module.exports = MasterProxy;
