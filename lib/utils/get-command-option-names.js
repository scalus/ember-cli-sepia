StringUtils = require('ember-cli/lib/utilities/string');

function getCommandOptionNames(command) {
  var availableOptions = command.prototype.availableOptions || [];
  var commandOptions   = [];
  availableOptions.forEach(function(option) {
    var optionName = StringUtils.dasherize(option['name'])
    commandOptions.push(optionName);
  });
  return commandOptions;
};

module.exports = getCommandOptionNames;
