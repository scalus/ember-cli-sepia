var BaseSubprocessGenerator = require('./base-generator');

var EmberCLIProcessGenerator = BaseSubprocessGenerator.extend({
  title:   'Ember-CLI',
  command: 'ember',

  processArgs: ['serve']

});

module.exports = EmberCLIProcessGenerator;
