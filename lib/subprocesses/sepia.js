var BaseSubprocessGenerator = require('../models/subprocess-generator');

var SepiaProcessGenerator = BaseSubprocessGenerator.extend({
  title: 'sepia',
  command: './node_modules/ember-cli-sepia/lib/tasks/run-sepia-proxy.js'
});

module.exports = SepiaProcessGenerator;
