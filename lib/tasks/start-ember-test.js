var EmberCLITestCommand      = require('ember-cli/lib/commands/test');
var SubprocessRunner         = require('../models/subprocess-runner');
var EmberCLIProcessGenerator = require('../subprocesses/ember-cli');
var getCommandOptionNames    = require('../utils/get-command-option-names');
var emberTestCommandOptions  = getCommandOptionNames(EmberCLITestCommand);

var StartEmberTest = SubprocessRunner.extend({
  // add ember CLI Options as camelCased
  // since commandOptions comes in as camelCased
  validCommandOptions: emberTestCommandOptions,

  generator: EmberCLIProcessGenerator,

  mergeWithConfigOptions: function(cliOptions) {
    return this.assign({}, this.config['emberCLI'], cliOptions)
  },

  serializeCLIArgs: function(cliOptions) {
    var args = this._super.apply(this, arguments)
    return ['test'].concat(args);
  }
});

module.exports = StartEmberTest;
