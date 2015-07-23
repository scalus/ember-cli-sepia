var BaseSubprocessGenerator = require('./base-generator');

var SepiaProcessGenerator = BaseSubprocessGenerator.extend({
  title: 'sepia',
  command: './node_modules/ember-cli-sepia/lib/subprocesses/start-sepia.js'
});

module.exports = SepiaProcessGenerator;
