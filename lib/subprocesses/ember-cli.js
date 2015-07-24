var BaseSubprocessGenerator = require('../models/subprocess-generator');

var EmberCLIProcessGenerator = BaseSubprocessGenerator.extend({
  title:   'Ember-CLI',
  command: 'ember',

  processArgs: ['serve']

});

module.exports = EmberCLIProcessGenerator;
