var Command = require('ember-cli/lib/models/command');
var path    = require('path');
var RSVP    = require('rsvp');
var assign  = require('lodash/object/assign');
var defaultConfig = require('../../sepia-config');
var safeSetProperties = require('../../utils/safe-set-properties');
var Supervisor  = require('../../models/supervisor');
var MasterProxy = require('../../proxies/master');
var EmberCLIProcessGenerator = require('../../subprocesses/ember-cli');
// tasks
var StartEmberServeTask = require('../../tasks/start-ember-serve');
var StartSepiaTask = require('../../tasks/start-sepia');

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
    { name: 'vcr-mode',          type: String, aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'sepia-config-file', type: String },
    { name: 'fixtures',         type: String,  aliases: ['f']},
    { name: 'sepia-port',       type: Number,  aliases: ['sp'] },
    // ember cli options for serve
    { name: 'port',             type: Number,  aliases: ['p'] },
    { name: 'host',             type: String,  aliases: ['H'] },
    { name: 'proxy',            type: String,  aliases: ['pr','pxy'] },
    { name: 'insecure-proxy',   type: Boolean, aliases: ['inspr'], description: 'Set false to proxy self-signed SSL certificates' },
    { name: 'watcher',          type: String,  aliases: ['w'] },
    { name: 'live-reload',      type: Boolean, aliases: ['lr'] },
    { name: 'live-reload-host', type: String,  aliases: ['lrh'], description: 'Defaults to host' },
    { name: 'live-reload-port', type: Number,  aliases: ['lrp'], description: '(Defaults to port number within [49152...65535] )'},
    { name: 'environment',      type: String,  aliases: ['e', {'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'output-path',      type: path,    aliases: ['op', 'out'] },
    { name: 'ssl',              type: Boolean },
    { name: 'ssl-key',          type: String  },
    { name: 'ssl-cert',         type: String  }
  ],

  createMasterProxy: function(options) {
    var proxyAttrs = safeSetProperties({}, {
      'port':         options['port'] || this.config['main']['port'],
      'emberPort':    options['emberPort'] || this.config['emberCLI']['port'],
      'sepiaPort':    options['sepiaPort'] || this.config['sepia']['port'],
      'proxyOptions': this.config['main']['proxyOptions'],
    });
    return new MasterProxy(proxyAttrs);
  },

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
      return RSVP.reject('must specify a vcr-mode, otherwise use `ember serve`');
    }
    process.env.VCR_MODE = commandOptions['vcrMode'];
    this.loadConfig(commandOptions['sepiaConfigFile']);

    this.masterProxy = this.createMasterProxy({
      mainPort:  commandOptions['mainPort'],
      emberPort: commandOptions['port'],
      sepiaPort: commandOptions['sepiaPort']
    });

    var startEmberCLI = new StartEmberServeTask(commandOptions, this.config);
    var startSepia    = new StartSepiaTask(commandOptions, this.config);

    this.supervisor = new Supervisor({
      processMap: {
        'ember-cli': startEmberCLI.run(),
        'sepia':     startSepia.run()
      }
    });

    attachProcessListeners(this.supervisor);
    this.masterProxy.start()
    // hang until user exits
    return new RSVP.Promise(function() {})
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
