var fs   = require('fs');
var path = require('path');
var RSVP = require('rsvp');

/*
  these utils are to be used over fs.exist since fs.exist and its counterparts
  are deprecated. fs.access is encouraged as a substitute
*/
function exists(filePath, modes) {
  if(modes == null) { modes = fs.R_OK; }
  try {
    var accessDenied = fs.accessSync(filePath, modes);
    return !accessDenied;
  } catch (e) {
    return false;
  }
}

module.exports = exists;
