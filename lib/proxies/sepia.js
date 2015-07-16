#!/usr/bin/env node
var http = require('http');
var HttpProxy = require('http-proxy');
var sepia = require('sepia');
var path = require('path');
var _ = require('lodash');

var PORT_REGEX = /:(\d+)/;
var RAILS_PORT = 4000;

function buildProxyTarget(req) {
  var host = req.headers.host;
  var protocol = req.protocol + '://';
  var port = ':' + RAILS_PORT;

  if(PORT_REGEX.test(host)) {
    return protocol + host.replace(PORT_REGEX, port);
  } else {
    return protocol + host + port;
  }
}

SepiaProxy = {
  start: function(config) {
    var options      = config.sepiaProxy;
    var fixturePath  = path.join(process.cwd(), options.fixturePath);
    var proxyOptions = _.extend({ buildProxyTarget: buildProxyTarget }, options.proxyOptions)

    sepia.fixtureDir(fixturePath);
    sepia.configure(options.sepiaOptions);

    var sepiaProxy = new Proxy(proxyOptions);
    sepiaProxy.start(options.port);

    return sepiaProxy;
  }
}

module.exports = SepiaProxy;
