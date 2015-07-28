StringUtils = require('ember-cli/lib/utilities/string');

function getCommandOptionNames(command) {
  var availableOptions = command.prototype.availableOptions || [];
  var commandOptions   = [];
  return availableOptions.map(function(option) {
    return StringUtils.dasherize(option['name'])
  });
};

module.exports = getCommandOptionNames;
