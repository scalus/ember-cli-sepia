var SubprocessFactory = require('../models/subprocess-factory');
var path = require('path');

var SepiaProcessFactory = SubprocessFactory.extend({
  title: 'sepia',

  validCommandOptions: ['sepiaPort', 'fixtures', 'sepiaConfigFile', 'vcrMode'],

  command: path.resolve(__dirname, '../tasks/run-sepia-proxy.js')
});

module.exports = SepiaProcessFactory;
