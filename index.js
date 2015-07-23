/* jshint node: true */
'use strict';
var SepiaTestemMiddleware = require('./lib/middleware/sepia-testem');
var commands = require('./lib/commands');

function EmberCLISepia() {
  this.name = 'ember-cli-sepia';
  return this;
}

EmberCLISepia.prototype.includedCommands = function() {
  return commands;
};

EmberCLISepia.prototype.testemMiddleware = function(app) {
  var sepiaTestem = new SepiaTestemMiddleware();
  if(!sepiaTestem.validVCRMode && process.argv.indexOf('test') < 0) { return; }
  sepiaTestem.useTestemMiddleware(app);
};

module.exports = EmberCLISepia;
