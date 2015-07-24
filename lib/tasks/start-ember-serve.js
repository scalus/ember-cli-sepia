var EmberCLIServeCommand     = require('ember-cli/lib/commands/serve');
var assign                   = require('lodash/object/assign');
var SubprocessRunner         = require('../models/subprocess-runner');
var EmberCLIProcessGenerator = require('../subprocesses/ember-cli');
var getCommandOptionNames    = require('../utils/get-command-option-names');
var emberServeCommandOptions = getCommandOptionNames(EmberCLIServeCommand);

var StartEmberCLI = SubprocessRunner.extend({
  // add ember CLI Options as camelCased
  // since commandOptions comes in as camelCased
  validCommandOptions: emberServeCommandOptions,

  generator: EmberCLIProcessGenerator,

  mergeWithConfigOptions: function(cliOptions) {
    return assign({}, this.config['emberCLI'], cliOptions)
  },

  serializeCLIArgs: function(cliOptions) {
    var args = this._super.apply(this, arguments)
    return ['serve'].concat(args);
  }
});

module.exports = StartEmberCLI;
