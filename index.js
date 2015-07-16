/* jshint node: true */
'use strict';
var commands = require('./lib/commands');

function SepiaProxy() {
  this.name = 'ember-cli-sepia';
  return this;
}

SepiaProxy.prototype.includedCommands = function() {
  return commands;
}

module.exports = SepiaProxy;
