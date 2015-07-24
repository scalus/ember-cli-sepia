var SubprocessRunner = require('../models/subprocess-runner');
var EmberCLIProcessGenerator = require('../subprocesses/ember-cli');

var StartEmberCLI = SubprocessRunner.extend({
  // add ember CLI Options as camelCased
  // since commandOptions comes in as camelCased
  validCommandOptions: [
    'port', 'host', 'proxy',
    'insecureProxy', 'watcher',
    'liveReload','liveReloadHost',
    'liveReloadPort','environment',
    'outputPath','ssl','sslKey',
    'sslCert'
  ],

  generator: EmberCLIProcessGenerator,

  mergeWithConfigOptions: function(cliOptions) {
    return this.assign({}, this.config['emberCLI'], cliOptions)
  },

  serializeCLIArgs: function(cliOptions) {
    var args = this._super.apply(this, arguments)
    return ['serve'].concat(args);
  }
});

module.exports = StartEmberCLI;
