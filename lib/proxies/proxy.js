#!/usr/bin/env node
var http       = require('http');
var HttpProxy  = require('http-proxy');
var CoreObject = require('core-object');

var PORT_REGEX = /:(\d+)/;

var Proxy = CoreObject.extend({
  name: '',

  port: 5000,

  proxyOptions: {
    ws: true,
    changeOrigin: true,
    autoRewrite:  true  // changes the redircts to have a matching host
  },

  buildProxyTarget: function(request) {
    var protocol = 'http://';
    var host = request.headers.host;
    return protocol + host;
  },

  buildProxyServer: function(options) {
    var proxy = HttpProxy.createProxyServer(options);
    this.initProxyServer(proxy);
    return proxy;
  },

  buildHttpServer: function() {
    var server = http.createServer(this.handleRequest.bind(this));
    server.on('upgrade', this.handleWebSocketUpgrade.bind(this));
    return server;
  },

  initProxyServer: function(proxy) {
    proxy.on('error', this.handleProxyError.bind(this));
  },

  handleRequest: function(request, response) {
    proxyRequestOptions = this.proxyRequestOptions || {};
    proxyRequestOptions.target = this.buildProxyTarget(request);
    this.proxy.web(request, response, proxyRequestOptions);
  },

  handleWebSocketUpgrade: function (request, socket, head) {
    console.log('Proxying websocket to ' + request.url);
    this.proxy.ws(request, socket, head);
  },

  handleProxyError: function(error, request, response) {
    console.log('error proxying to', request.url, error);
    response.end();
  },

  replacePort: function(url, port) {
    portString = ':' + port;
    if(PORT_REGEX.test(url)) {
      return url.replace(PORT_REGEX, portString);
    } else {
      return url + portString;
    }
  },

  start: function() {
    this.proxy  = this.buildProxyServer(this.proxyOptions);
    this.server = this.buildHttpServer();
    this.server.listen(this.port);
    console.log(this.name, 'serving on port', this.port);
    return this.server;
  }

});


module.exports = Proxy;
