var safeSetProperty = require('./safe-set-property');

function safeSetProperties(object, propertyHash) {
  for(var propName in propertyHash) {
    safeSetProperty(object, propName, propertyHash[propName]);
  }
  return object;
}

module.exports = safeSetProperties;
