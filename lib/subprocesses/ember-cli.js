var BaseSubprocessGenerator = require('./base-generator');

var EmberCLIProcessGenerator = BaseSubprocessGenerator.extend({
  title:   'Ember-CLI',
  command: 'ember',

  processArgs: ['serve', '--proxy', 'http://*.lvh.me:4000']

});

module.exports = EmberCLIProcessGenerator;
