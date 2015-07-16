#!/usr/bin/env node

var ChildProcess = require('child_process');

function Subprocess() {
  this.process = this.generateProcess();
  this.attachDefaultListeners();
}

Subprocess.prototype.processName = '';

Subprocess.prototype.generateProcess = function() {
  throw new Error('Must implement generateProcess');
};

Subprocess.prototype.on = function() {
  return this.process.on.apply(this.process, arguments);
}

Subprocess.prototype.attachDefaultListeners() {
  if(!this.process) { return; }
  name = this.processName + ': ';

  this.process.stdout.on('data', function(data) {
    console.log(name, ': ', data.toString());
  });

  this.on('error', function (error) {
    console.log(name, ': failed with error');
    throw error;
  });

  this.on('close', function (code) {
    console.log(name, ': exited with code ' + code);
  });
}

module.exports = Subprocess;
