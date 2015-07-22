/* jshint node: true */
'use strict';
var SepiaTestemMiddleware = require('./lib/middleware/sepia-testem');
// var commands = require('./lib/commands');

// function SepiaProxy() {
//   this.name = 'ember-cli-sepia';
//   return this;
// }

// SepiaProxy.prototype.includedCommands = function() {
//   return commands;
// }

module.exports = {
  name: 'ember-cli-sepia',

  testemMiddleware: function(app) {
    var sepiaTestem = new SepiaTestemMiddleware();
    if(!sepiaTestem.validVCRMode && process.argv.indexOf('test') < 0) { return; }
    sepiaTestem.useTestemMiddleware(app);
  }
};
