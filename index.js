/* jshint node: true */
'use strict';
var CoreObject = require('core-object');
var SepiaTestemMiddleware = require('./lib/middleware/sepia-testem');
var commands = require('./lib/commands');

var VALID_VCR_MODES = ['playback', 'cache', 'record'];

var EmberCLISepia = CoreObject.extend({
  name: 'ember-cli-sepia',

  includedCommands: function() {
    return commands;
  },

  testemMiddleware: function(app) {
    if(!isValidVCRMode(process.env.VCR_MODE) || process.argv.indexOf('sepia:test') < 0) { return; }
    var sepiaTestem = new SepiaTestemMiddleware();
    sepiaTestem.attachMiddlewareTo(app);
  }
});

function isValidVCRMode(vcrMode) {
  if(!vcrMode) { return false; }
  return VALID_VCR_MODES.some(function(mode) {
    return vcrMode.toLowerCase() === mode
  });
}

module.exports = EmberCLISepia;
