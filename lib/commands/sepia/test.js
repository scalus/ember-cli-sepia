var Command = require('ember-cli/lib/models/command');
var RSVP    = require('rsvp');
var Supervisor           = require('../../models/supervisor');
var ConfigurationManager = require('../../models/configuration-manager');
var EmberCommandFactory  = require('../../models/ember-command-factory');
var getAvailableOptions  = require('../../utils/get-available-options');
var EmberCLITestCommand  = require('ember-cli/lib/commands/test');
var emberTestOptions     = getAvailableOptions(EmberCLITestCommand);

var SepiaTest = Command.extend({
  name: 'sepia:test',
  description: 'starts sepia and runs ember cli in test mode',
  works: 'insideProject',

  // clean up help messages
  printBasicHelp: Command.prototype.printBasicHelp,
  printDetailedHelp: function() {},

  availableOptions: [
    { name: 'vcr-mode',          type: String,  aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'sepia-config-file', type: String },
    { name: 'fixtures',          type: String },
    { name: 'sepia-port',        type: Number,  aliases: ['sp'] }
  ].concat(emberTestOptions),

  run: function(commandOptions, rawArgs) {
    process.env.SUPERVISOR_LOG_LEVEL = process.env.SUPERVISOR_LOG_LEVEL || Supervisor.LOG_LEVEL.ERROR;
    if(!commandOptions['vcrMode']) {
      console.log('vcr-mode was not specified, defaulting to `playback`')
      commandOptions['vcrMode'] = 'playback'
    }
    process.env.VCR_MODE = commandOptions['vcrMode'];
    var configManager    = new ConfigurationManager(commandOptions);
    // hack for the middleware to use these things
    process.env.SEPIA_PORT        = process.env.SEPIA_PORT ||  configManager.get('sepia.port');
    process.env.SEPIA_FIXTURES    = process.env.SEPIA_FIXTURES || configManager.get('sepia.fixtures');
    process.env.SEPIA_CONFIG_FILE = process.env.SEPIA_CONFIG_FILE || configManager.get('sepiaConfigFile');
    var emberCommand = new EmberCommandFactory('test', this);
    return emberCommand.run(commandOptions);
  }
});


module.exports = SepiaTest;
