var SepiaProcessGenerator = require('../subprocesses/sepia');
var HttpProxy   = require('http-proxy');
// check user sepia config too
var sepiaConfig = require('../sepia-config')['sepia'];

// should come from config
var API_REGEX  = /api\//;
var PORT_REGEX = /:(\d+)/;

function buildProxyTarget(request) {
  var host     = request.headers.host;
  var protocol = 'http://';
  var url      = protocol + host;
  var port = ':' + process.env.SEPIA_PORT
  if(PORT_REGEX.test(url)) {
    return url.replace(PORT_REGEX, port);
  } else {
    return url + port;
  }
}

function SepiaTestemMiddleware(options) {
  this.name    = 'sepia-testem-middleware';
  this.options = options || {};
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
    console.error('Error proxying from testem');
    response.end();
  });

  return proxy;
}

SepiaTestemMiddleware.prototype.createSepiaProcess = function() {
  var sepiaGenerator = new SepiaProcessGenerator;
  var sepiaArgs = [
    '--sepia-port', process.env.SEPIA_PORT.toString(),
    '--fixtures',   process.env.SEPIA_FIXTURES,
    '--vcr-mode',   process.env.VCR_MODE
  ];
  if(process.env.SEPIA_CONFIG_FILE) {
    sepiaArgs.push('--sepia-config-file');
    sepiaArgs.push(process.env.SEPIA_CONFIG_FILE);
  }
  var sepia = sepiaGenerator.generate(sepiaArgs);
  sepia.on('error', function(error) {
    throw error;
  });
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
    console.error('there was a problem in the main process, killing Sepia Proxy');
    sepia.kill('SIGINT');
  });

  return sepia;
}

module.exports = SepiaTestemMiddleware;
