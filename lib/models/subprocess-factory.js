var CoreObject = require('core-object');


var SubprocessFactory = CoreObject.extend({
  validCommandOptions: [],
  config: {},
  processOptions: {},
  processArgs: [],

  init: function(commandOptions, options) {
    this._super.call(this, options);
    this.processArgs = this.normalizeArgs(commandOptions);
  },

  normalizeArgs: function(commandOptions) {
    var cliOptions = {};

    for(var optionName in commandOptions) {
      if(this.validCommandOptions.indexOf(optionName) < 0 || commandOptions[optionName] == null) { continue; }
      cliOptions[optionName] = commandOptions[optionName];
    }

    var options = this.mergeWithConfigOptions(cliOptions);
    return this.serializeCLIArgs(options);
  }
});

module.exports = SubprocessFactory;
