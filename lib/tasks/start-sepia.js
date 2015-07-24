var SubprocessRunner = require('../models/subprocess-runner');
var SepiaProcessGenerator = require('../subprocesses/sepia');

var StartSepia = SubprocessRunner.extend({

  validCommandOptions: ['sepiaPort', 'fixtures', 'sepiaConfigFile', 'vcrMode'],

  generator: SepiaProcessGenerator,

  mergeWithConfigOptions: function(cliOptions) {
    var sepiaConfig = this.config['sepia'];
    if(!sepiaConfig) { return this._super.apply(this, arguments); }
    return this.assign({
      sepiaPort: sepiaConfig['port'],
      fixtures:  sepiaConfig['fixtureDir']
    }, cliOptions)
  }
});

module.exports = StartSepia;
