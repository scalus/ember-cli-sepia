#!/usr/bin/env node
var ChildProcess = require('child_process');
var path = require('path');
var BaseSubprocess = require('./base');

EmberCLIProcess = function(emberCLIArgs) {
  this.cliArgs = emberCLIArgs;
  BaseSubprocess.call(this);
};

EmberCLIProcess.prototype   = Object.create(BaseSubprocess.prototype);
EmberCLIProcess.constructor = EmberCLIProcess;

EmberCLIProcess.prototype.processName = 'Ember-CLI';

EmberCLIProcess.prototype.generateProcess = function() {
  return ChildProcess.spawn('ember', this.cliArgs, {
    stdout: 'inherit',
    cwd: process.cwd()
  });
};

module.exports = EmberCLIProcess;
