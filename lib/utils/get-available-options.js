function getAvailableOptions(command, attrs) {
  var availableOptions = command.prototype.availableOptions || [];
  if(!attrs) { return availableOptions; }
  return availableOptions.map(function(option) {
    var cleansedOption = {};
    attrs.forEach(function(attr){
      if(!option[attr]) return;
      cleansedOption[attr] = option[attr];
    });
    return cleansedOption;
  });
};

module.exports = getAvailableOptions;
