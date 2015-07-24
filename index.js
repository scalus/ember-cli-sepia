/* jshint node: true */
'use strict';
var SepiaTestemMiddleware = require('./lib/middleware/sepia-testem');
var commands = require('./lib/commands');

var VALID_VCR_MODES = ['playback', 'cache', 'record'];
var VCR_MODE        = process.env.VCR_MODE;

var validVCRMode = VALID_VCR_MODES.some(function(mode) {
  return VCR_MODE.toLowerCase() === mode
});

function EmberCLISepia() {
  this.name = 'ember-cli-sepia';
  return this;
}

EmberCLISepia.prototype.includedCommands = function() {
  return commands;
};

EmberCLISepia.prototype.testemMiddleware = function(app) {
  var sepiaTestem = new SepiaTestemMiddleware();
  if(!validVCRMode || process.argv.indexOf('sepia:test') < 0) { return; }
  sepiaTestem.useTestemMiddleware(app);
};

module.exports = EmberCLISepia;
