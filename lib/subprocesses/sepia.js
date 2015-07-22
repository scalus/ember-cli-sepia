var BaseSubprocessGenerator = require('./base-generator');

var SepiaProcessGenerator = BaseSubprocessGenerator.extend({
  title: 'sepia',
  command: './node_lib/sepia/subprocesses/start-sepia.js'
});

module.exports = SepiaProcessGenerator;
