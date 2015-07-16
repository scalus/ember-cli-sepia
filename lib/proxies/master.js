#!/usr/bin/env node
var http = require('http');
var HttpProxy = require('http-proxy');
var Proxy = require('./proxy');
var _ = require('lodash');

var APP_HOST = 'lvh.me';
var API_URL_REGEX = /api\//;
var PORT_REGEX = /:(\d+)/;
var MAIN_PORT  = 8080;
var RAILS_PORT = 4000;
var SEPIA_PORT = 5000;
var EMBER_CLI_PORT = 4200;

function buildProxyTarget(req) {
  var port = API_URL_REGEX.test(req.url) ? SEPIA_PORT : EMBER_CLI_PORT;
  port = ':' + port;
  var protocol = req.protocol + '://';
  var host = req.headers.host;

  if(PORT_REGEX.test(host)) {
    return protocol + host.replace(PORT_REGEX, port);
  } else {
    return protocol + host + port;
  }
}

module.exports = {
  start: function(config) {
    var options = config.server;
    var proxyOptions = _.extend({ buildProxyTarget: buildProxyTarget }, options.proxyOptions);

    var masterProxy = new Proxy(proxyOptions);
    masterProxy.start(options.port);

    return masterProxy;
  }
}
