var CoreObject  = require('core-object');
var assign      = require('lodash/object/assign');
var stringUtils = require('ember-cli/lib/utilities/string');
var SubprocessRunner = CoreObject.extend({
  // commandOptions come in as camelCased
  validCommandOptions: [],

  init: function(commandOptions, config) {
    this._super();
    this.config = config;
    this.processArgs = this.normalizeArgs(commandOptions);
  },

  assign: assign,

  generator: null,

  normalizeArgs: function(commandOptions) {
    var cliOptions = {};

    for(var optionName in commandOptions) {
      if(this.validCommandOptions.indexOf(optionName) < 0 || commandOptions[optionName] == null) { continue; }
      cliOptions[optionName] = commandOptions[optionName];
    }

    var options = this.mergeWithConfigOptions(cliOptions);
    return this.serializeCLIArgs(options);
  },

  // use this to hook into and merge with config
  mergeWithConfigOptions: function(cliOptions) {
    return this.assign({}, cliOptions)
  },

  serializeCLIArgs: function(cliOptions) {
    var args = [];
    var optionName;
    for(optionName in cliOptions) {
      // this name needs to be dasherized
      var cliArgName  = '--' + stringUtils.dasherize(optionName);
      var cliArgValue = cliOptions[optionName];
      // do not push boolean switches
      if(cliArgValue === false) { continue; }
      args.push(cliArgName);
      // boolean switches do not need a value
      if(cliArgValue === true) { continue; }
      args.push(cliArgValue.toString());
    }
    return args;
  },

  run: function() {
    if(!this.generator) { throw new Error('a subprocess generator is required'); }
    var generator = new this.generator;
    return generator.generate(this.processArgs);
  }
});

module.exports = SubprocessRunner;
