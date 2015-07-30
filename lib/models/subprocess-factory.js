var CoreObject   = require('core-object');
var ChildProcess = require('child_process');
var merge        = require('lodash/object/merge');
var stringUtils  = require('ember-cli/lib/utilities/string');

var SubprocessFactory = CoreObject.extend({
  command: '',
  title: '',
  validCommandOptions: [],
  processArgs:    [], // i dont think these are ever used.
  processOptions: {},
  spawnOptions:   {},

  init: function(options) {
    if(!options) { return this._super(); }
    options.spawnOptions = pickSpawnOptionKeys(options.spawnOptions);
    this._super.apply(this, arguments);
  },

  processInit: function(childProcess) {
    childProcess.title = this.title;
  },

  spawn: function(commandOptions, options) {
    var args, childProcess;
    this._requireCommand();
    args         = this.normalizeArgs(commandOptions) || this.processArgs;
    options      = this._getSpawnOptions(options);
    childProcess = this._generateProcess(args, options);
    this.processInit(childProcess);
    return childProcess;
  },

  normalizeArgs: function(commandOptions) {
    var cliOptions = this._filterCommandOptions(commandOptions);
    var defaultCommandOptions = this._filterCommandOptions(this.processOptions);
    var options = merge({}, defaultCommandOptions, cliOptions);
    if(!Object.keys(options).length) { return; }
    return this._serializeCLIArgs(options);
  },

  _filterCommandOptions: function(commandOptions) {
    var options = {};
    for(var optionName in commandOptions) {
      if(this.validCommandOptions.indexOf(optionName) < 0 || commandOptions[optionName] == null) { continue; }
      options[optionName] = commandOptions[optionName];
    }
    return options;
  },

  _serializeCLIArgs: function(options) {
    var args = [];
    var optionName;
    for(optionName in options) {
      var cliArgName  = '--' + stringUtils.dasherize(optionName);
      var cliArgValue = options[optionName];
      args.push(cliArgName);
      args.push(cliArgValue.toString());
    }
    return args;
  },

  _getSpawnOptions: function(options) {
    options = options || {};
    var defaultOptions = { cwd: process.cwd(), stdio: 'inherit' };
    return merge(defaultOptions, this.spawnOptions, options);
  },

  _generateProcess: function(args, options) {
    return ChildProcess.spawn(this.command, args, options);
  },

  _requireCommand: function() {
    if(this.command) { return; }
    throw new Error('SubprocessFactory must supply a command to spawn a subprocess');
  }
});

var PROCESS_OPTIONS = ['cwd','env','stdio','customFds','detached','uid','gid'];

function pickSpawnOptionKeys(hash) {
  hash = hash || {};
  var options = {};
  PROCESS_OPTIONS.forEach(function(opt) {
    if(hash[opt] == null) { return; }
    options[opt] = hash[opt];
  });
  return options;
}

module.exports = SubprocessFactory;
