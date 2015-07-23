var SepiaProcessGenerator = require('../subprocesses/sepia');
var HttpProxy = require('http-proxy');
var sepiaConfig = require('../sepia-config')['sepia'];

var API_REGEX  = /api\//;
var PORT_REGEX = /:(\d+)/;

function buildProxyTarget(request) {
  var host     = request.headers.host;
  var protocol = 'http://';
  var url      = protocol + host;
  var port = ':' + sepiaConfig['port']
  if(PORT_REGEX.test(url)) {
    return url.replace(PORT_REGEX, port);
  } else {
    return url + port;
  }
}

function SepiaTestemMiddleware(project) {
  this.project = project;
  this.name = 'sepia-testem-middleware';
}

SepiaTestemMiddleware.prototype.useTestemMiddleware = function (app) {
  this.sepiaProcess = this.createSepiaProcess();
  var proxy = this.createProxyServer();
  this.proxy = proxy;
  app.use(function(request, response, next) {
    if(API_REGEX.test(request.url)) {
      return proxy.web(request, response, { target: buildProxyTarget(request) });
    }
    next()
  });
};

SepiaTestemMiddleware.prototype.createProxyServer = function() {
  var proxy = HttpProxy.createProxyServer({
    ws: true,
    changeOrigin: true,
    autoRewrite:  true  // changes the redircts to have a matching host
  });

  proxy.on('error', function(error, request, response) {
    console.log('Error proxying from testem');
    response.end();
  });

  return proxy;
}

SepiaTestemMiddleware.prototype.createSepiaProcess = function() {
  var sepiaGenerator = new SepiaProcessGenerator;
  var sepia = sepiaGenerator.generate();
  // SIGTERM AND SIGINT will trigger the exit event.
  exitProcess =  function () { process.exit(0); }
  process.once("SIGTERM", exitProcess);
  process.once("SIGINT", exitProcess);
  // And the exit event shuts down the child.
  process.once("exit", function () {
    console.log('Shutting down Sepia Proxy...');
    sepia.kill('SIGINT');
  });

  process.on('error', function(error) {
    console.log('there was a problem in the main process, killing Sepia Proxy');
    sepia.kill('SIGINT');
  });

  return sepia;
}

SepiaTestemMiddleware.prototype.validVCRMode = (function() {
  var valid = false;
  var VCR_MODE = process.env.VCR_MODE
  var validVCRModes = ['playback', 'cache', 'record'];
  validVCRModes.forEach(function(mode) {
    if(VCR_MODE && mode === VCR_MODE.toLowerCase()) { valid = true; }
  });
  return valid;
}).call(null);

module.exports = SepiaTestemMiddleware;
