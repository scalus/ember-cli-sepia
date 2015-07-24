var sepia  = require('sepia');
var path   = require('path');
var Proxy  = require('../models/proxy');
var config = require('../sepia-config');

var SepiaProxy = Proxy.extend({
  name:             'Sepia',
  port:             config['sepia']['port'],
  fixtureDir:       config['sepia']['fixtureDir'],
  sepiaOptions:     config['sepia']['sepiaOptions'],
  APIServersConfig: config['APIServers'],

  // this should support more than a single api server
  // in the future
  getProxyPort: function() {
    return this.APIServersConfig['default']['port'];
  },

  buildProxyTarget: function(request) {
    var host = request.headers.host;
    var protocol = 'http://';
    var url = protocol + host;
    var fullURL = this.replacePort(url, this.getProxyPort());
    return fullURL;
  },

  start: function() {
    var sepiaFilters = this.sepiaOptions['filters'];
    sepia.fixtureDir(path.join(process.cwd(), this.fixtureDir));
    // Warning: this globally takes over http.request
    sepia.configure(this.sepiaOptions);
    if(sepiaFilters && sepiaFilters.length > 0) {
      sepiaFilters.forEach(function(filter) { sepia.filter(filter); });
    }
    return this._super.apply(this, arguments);
  }
});


module.exports = SepiaProxy;
