#!/usr/bin/env node
var ChildProcess = require('child_process');
var path = require('path');
var BaseSubprocess = require('./base');

SepiaProcess = function(options) {
  BaseSubprocess.call(this);
  this.process.send({ type: 'start', options: options });
};

SepiaProcess.prototype   = Object.create(BaseSubprocess.prototype);
SepiaProcess.constructor = SepiaProcess;

SepiaProcess.prototype.processName = 'Sepia';

SepiaProcess.prototype.generateProcess = function() {
  return ChildProcess.spawn('./start-sepia.js', {
    stdout: 'inherit',
    cwd: process.cwd()
  });
};

module.exports = SepiaProcess;
