#!/usr/bin/env node
var ChildProcess = require('child_process');
var CoreObject   = require('core-object');
var assign       = require('lodash/object/assign');

var PROCESS_OPTIONS = ['cwd','env','stdio','customFds','detached','uid','gid'];

function pickProcessOptionKeys(hash) {
  var options = {};
  PROCESS_OPTIONS.forEach(function(opt) {
    if(hash[opt] == null) { return; }
    options[opt] = hash[opt];
  });
  return options;
}


var SubprocessGenerator = CoreObject.extend({
  command: '',

  title: '',

  processArgs: [],

  init: function(options) {
    options = options || {};
    this._super.apply(this, arguments);
    this.processOptions = pickProcessOptionKeys(options);
  },

  generate: function(args, options) {
    this._requireCommand();
    var defaultOptions, childProcess;
    args = args || this.processArgs
    defaultOptions = { cwd: process.cwd(), stdio: 'inherit' }
    options = assign(defaultOptions, this.processOptions, options);
    childProcess = this.generateProcess(args, options);
    this.processInit(childProcess);
    return childProcess;
  },

  processInit: function(childProcess) {
    childProcess.title = this.title;
  },

  generateProcess: function(args, options) {
    return ChildProcess.spawn(this.command, args, options);
  },

  _requireCommand: function() {
    if(this.command) { return; }
    throw new Error('SubprocessGenerator must supply a command to spawn a subprocess');
  }
});

module.exports = SubprocessGenerator;
