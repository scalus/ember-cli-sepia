function safeSetProperty(object, propertyName, value) {
  if(value == null){ return object; }
  object[propertyName] = value;
  return object;
}

module.exports = safeSetProperty;
