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
    if(!isValidVCRMode() || process.argv.indexOf('test') < 0) { return; }
    var sepiaTestem = new SepiaTestemMiddleware();
    sepiaTestem.attachMiddlewareTo(app);
  }
});

function isValidVCRMode() {
  if(!process.env.VCR_MODE) { return false; }
  var VCR_MODE = process.env.VCR_MODE.toLowerCase();
  return VALID_VCR_MODES.some(function(mode) {
    return VCR_MODE.toLowerCase() === mode
  });
}

module.exports = EmberCLISepia;
