var Command = require('ember-cli/lib/models/command');
var RSVP    = require('rsvp');
var ConfigurationManager = require('../../models/configuration-manager');
var Supervisor  = require('../../models/supervisor');
var MasterProxy = require('../../proxies/master');
// tasks
var SepiaProcessFactory  = require('../../subprocesses/sepia');
var EmberCommandFactory  = require('../../models/ember-command-factory');

var EmberCLIServeCommand = require('ember-cli/lib/commands/serve');
var getAvailableOptions  = require('../../utils/get-available-options');
var emberServeOptions    = getAvailableOptions(EmberCLIServeCommand);

// parseArgs on command can be modified to pass on ember commands
var SepiaServe = Command.extend({
  name: 'sepia:serve',
  description: 'starts sepia and ember cli and proxies to each accordingly',
  works: 'insideProject',

  // clean up help messages
  printBasicHelp: Command.prototype.printBasicHelp,
  printDetailedHelp: function() {},

  availableOptions: [
    // main
    { name: 'main-port', type: Number, aliases: ['mp'] },
    // sepia
    { name: 'vcr-mode',          type: String,  aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'sepia-config-file', type: String },
    { name: 'fixtures',          type: String },
    { name: 'sepia-port',        type: Number,  aliases: ['sp'] },
  ].concat(emberServeOptions),

  spawnSepia: function(commandOptions, configManager) {
    if(!this.sepiaProcessFactory) {
      this.sepiaProcessFactory = new SepiaProcessFactory({
        processOptions: {
          sepiaPort: configManager.get('sepia.port'),
          fixtures:  configManager.get('sepia.fixtures')
        }
      });
    }
    return this.sepiaProcessFactory.spawn(commandOptions);
  },

  createMasterProxy: function(configManager) {
    if(this.masterProxy) { return this.masterProxy; }
    return new MasterProxy({
      port:         configManager.get('main.port'),
      emberPort:    configManager.get('emberCLI.port'),
      sepiaPort:    configManager.get('sepia.port'),
      proxyOptions: configManager.get('main.proxyOptions')
    });
  },

  run: function(commandOptions, rawArgs) {
    process.env.SUPERVISOR_LOG_LEVEL = process.env.SUPERVISOR_LOG_LEVEL || Supervisor.LOG_LEVEL.DEBUG;
    process.env.VCR_MODE = process.env.VCR_MODE || commandOptions['vcrMode'];
    if(!process.env.VCR_MODE) {
      return RSVP.reject('must specify a vcr-mode, otherwise use `ember serve`');
    }
    var configManager = new ConfigurationManager(commandOptions);
    var sepiaProcess  = this.spawnSepia(commandOptions, configManager);
    var emberServe    = new EmberCommandFactory('serve', this);
    this.supervisor   = new Supervisor;
    this.masterProxy  = this.createMasterProxy(configManager);

    this.supervisor.watchProcess('sepia', sepiaProcess);
    attachProcessListeners(this.supervisor);
    this.masterProxy.start();
    return emberServe.run(commandOptions);
  }
});

function attachProcessListeners(supervisor) {
  // SIGTERM AND SIGINT will trigger the exit event.
  process.once("SIGTERM", function () {
    process.exit(0);
  });
  process.once("SIGINT", function () {
    process.exit(0);
  });
  // And the exit event shuts down the child.
  process.once("exit", function () {
    console.log('Shutting down Ember CLI, Sepia, and Master Proxy...');
    supervisor.killAll('SIGINT');
  });

  process.on('error', function(error) {
    console.log('there was a problem in the main process');
    supervisor.killAll('SIGTERM');
    throw error;
  });
}

module.exports = SepiaServe;
