var CoreObject  = require('core-object');
var stringUtils = require('ember-cli/lib/utilities/string');

var EmberCommandFactory = CoreObject.extend({
  availableOptions: [],

  init: function(commandName, parentCommand) {
    this._super();
    var commands     = parentCommand.commands;
    var EmberCommand = this._lookupCommand(commands, commandName);

    this.availableOptions = EmberCommand.prototype.availableOptions;

    this.command = new EmberCommand({
      ui:        parentCommand.ui,
      analytics: parentCommand.analytics,
      commands:  commands,
      tasks:     parentCommand.tasks,
      project:   parentCommand.project,
      settings:  parentCommand.settings,
      testing:   parentCommand.testing,
      cli:       parentCommand.cli
    });
  },

  cleanseCommandOptions: function(commandOptions) {
    var cliOptions = {};
    for(var optionName in commandOptions) {
      if(this.availableOptions.indexOf(optionName) < 0 || commandOptions[optionName] == null) { continue; }
      cliOptions[optionName] = commandOptions[optionName];
    }
    return commandOptions;
  },

  run: function(commandOptions) {
    var options = this.cleanseCommandOptions(commandOptions);
    return this.command.run(options);
  },

  _lookupCommand: function(commands, commandName) {
    commandName = stringUtils.classify(commandName);
    return commands[commandName];
  }
});

module.exports = EmberCommandFactory;
