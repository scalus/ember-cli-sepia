#!/usr/bin/env node
var http = require('http');
var HttpProxy = require('http-proxy');
var path = require('path');

function defaultBuildProxyTarget(request) {
  var protocol = request.protocol + '://';
  var host = request.headers.host;
  return protocol + host;
}

function Proxy(options) {
  this.buildProxyTarget = options.buildProxyTarget || defaultBuildProxyTarget;
  delete options.buildProxyTarget;
  this.options = options || {};
  this.proxyServer = HttpProxy.createProxyServer(this.options);
}

Proxy.prototype.start = function(port, proxyOptions) {
  proxyServer      = this.proxyServer
  buildProxyTarget = this.buildProxyTarget;
  proxyOptions     = proxyOptions || {};

  function serverHandler(request, response) {
    proxyOptions.targetURL = buildProxyTarget(request);
    proxyServer.web(req, res, proxyOptions);
  }

  this.server = http.createServer(serverHandler).listen(port);
}
