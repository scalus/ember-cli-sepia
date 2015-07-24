function getAvailableOptions(command, attrs) {
  var availableOptions = command.prototype.availableOptions || [];
  if(!attrs) { return availableOptions; }
  return availableOptions.map(function(option) {
    var clensedOption = {};
    attrs.forEach(function(attr){
      if(!option[attr]) return;
      clensedOption[attr] = option[attr];
    });
    return clensedOption;
  });
};

module.exports = getAvailableOptions;
