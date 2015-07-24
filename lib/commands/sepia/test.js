var Command = require('ember-cli/lib/models/command');
var RSVP    = require('rsvp');
var assign  = require('lodash/object/assign');
var defaultConfig = require('../../sepia-config');
var EmberCLITestCommand = require('ember-cli/lib/commands/test');
var getAvailableOptions = require('../../utils/get-available-options');
var emberTestOptions    = getAvailableOptions(EmberCLITestCommand, ['name', 'type', 'aliases']);

var StartEmberTestTask  = require('../../tasks/start-ember-test');

var SepiaTest = Command.extend({
  name: 'sepia:test',
  description: 'starts sepia and runs ember cli in test mode',
  works: 'insideProject',

  // clean up help messages
  printBasicHelp: Command.prototype.printBasicHelp,
  printDetailedHelp: function() {},

  availableOptions: [
    // sepia
    { name: 'vcr-mode',          type: String,  aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'sepia-config-file', type: String },
    { name: 'fixtures',          type: String },
    { name: 'sepia-port',        type: Number,  aliases: ['sp'] }
  ].concat(emberTestOptions),

  loadConfig: function(configPath) {
    if(this.config) { return this.config; }
    if(configPath == null) {
      return this.config = defaultConfig;
    } else {
      var userConfig = require(configPath);
      return this.config = assign({}, defaultConfig, userConfig);
    }
  },

  run: function(commandOptions, rawArgs) {
    if(!commandOptions['vcrMode']) {
      console.log('vcr-mode was not specified, defaulting to `playback`')
      commandOptions['vcrMode'] = 'playback'
    }

    this.loadConfig(commandOptions['sepiaConfigFile']);
    // hack for the middleware to use these things
    process.env.VCR_MODE          = process.env.VCR_MODE || commandOptions['vcrMode'];
    process.env.SEPIA_PORT        = process.env.SEPIA_PORT || commandOptions['sepiaPort'] || this.config['sepia']['port'];
    process.env.SEPIA_FIXTURES    = process.env.SEPIA_FIXTURES || commandOptions['fixtures']  || this.config['sepia']['fixtures'];
    process.env.SEPIA_CONFIG_FILE = process.env.SEPIA_CONFIG_FILE || commandOptions['sepiaConfigFile'];
    var emberTest = new StartEmberTestTask(commandOptions, this.config);
    var emberTestProcess = emberTest.run();
    // hang until user exits
    return new RSVP.Promise(function() {});
  }
});


module.exports = SepiaTest;
