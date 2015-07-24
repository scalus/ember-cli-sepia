/* jshint node: true */
'use strict';
var SepiaTestemMiddleware = require('./lib/middleware/sepia-testem');
var commands = require('./lib/commands');

var VALID_VCR_MODES = ['playback', 'cache', 'record'];

function isValidVCRMode() {
  if(!process.env.VCR_MODE) { return false; }
  var VCR_MODE = process.env.VCR_MODE.toLowerCase();
  return VALID_VCR_MODES.some(function(mode) {
    return VCR_MODE.toLowerCase() === mode
  });
}

function EmberCLISepia() {
  this.name = 'ember-cli-sepia';
  return this;
}

EmberCLISepia.prototype.includedCommands = function() {
  return commands;
};

EmberCLISepia.prototype.testemMiddleware = function(app) {
  if(!isValidVCRMode() || process.argv.indexOf('test') < 0) { return; }
  var sepiaTestem = new SepiaTestemMiddleware();
  sepiaTestem.attachMiddlewareTo(app);
};

module.exports = EmberCLISepia;
