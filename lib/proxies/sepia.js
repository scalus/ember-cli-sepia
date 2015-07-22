var sepia  = require('sepia');
var path   = require('path');
var Proxy  = require('./proxy');
var config = require('../sepia-config');

var sepiaConfig = config['sepia'];
var sepiaFilters = sepiaConfig['sepiaOptions']['filters'];
var RAILS_PORT  = config['APIServers']['rails']['port'];

var SepiaProxy = Proxy.extend({
  name: 'Sepia',

  port: sepiaConfig['port'],

  fixtureDir: sepiaConfig['fixtureDir'],

  buildProxyTarget: function(request) {
    var host = request.headers.host;
    var protocol = 'http://';
    var url = protocol + host;
    var fullURL = this.replacePort(url, RAILS_PORT)
    return fullURL;
  },

  start: function() {
    sepia.fixtureDir(path.join(process.cwd(), sepiaConfig['fixtureDir']));
    // Warning: this globally takes over http.request
    sepia.configure(sepiaConfig['sepiaOptions']);
    console.log('filters', sepiaConfig['sepiaOptions']);
    if(sepiaFilters && sepiaFilters.length > 0) {
      sepiaFilters.forEach(function(filter) { sepia.filter(filter); });
    }
    return this._super.apply(this, arguments);
  }
});


module.exports = SepiaProxy;
