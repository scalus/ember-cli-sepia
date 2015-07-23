var Command = require('ember-cli/lib/models/command');
var path    = require('path');
var RSVP    = require('rsvp');
var assign  = require('lodash/object/assign');
var defaultConfig = require('../../sepia-config');
var safeSetProperties = require('../../utils/safe-set-properties');
var Supervisor    = require('../../models/supervisor');
var MasterProxy   = require('../../proxies/master');
var SepiaProcessGenerator    = require('../../subprocesses/sepia');
var EmberCLIProcessGenerator = require('../../subprocesses/ember-cli');

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
    { name: 'vcr-mode', type: String, aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'sepia-config-file', type: String },
    { name: 'fixtures', type: String, aliases: ['f']},
    { name: 'sepia-port', type: Number, aliases: ['sp'] },
    // ember cli options for serve
    { name: 'port', type: Number, aliases: ['p'] },
    { name: 'host', type: String, aliases: ['H'] },
    { name: 'proxy',  type: String, aliases: ['pr','pxy'] },
    { name: 'insecure-proxy', type: Boolean, description: 'Set false to proxy self-signed SSL certificates', aliases: ['inspr'] },
    { name: 'watcher',  type: String, aliases: ['w'] },
    { name: 'live-reload',  type: Boolean, aliases: ['lr'] },
    { name: 'live-reload-host', type: String, description: 'Defaults to host', aliases: ['lrh'] },
    { name: 'live-reload-port', type: Number, description: '(Defaults to port number within [49152...65535] )', aliases: ['lrp']},
    { name: 'environment', type: String, aliases: ['e', {'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'output-path', type: path, aliases: ['op', 'out'] },
    { name: 'ssl', type: Boolean },
    { name: 'ssl-key', type: String },
    { name: 'ssl-cert', type: String }
  ],

  emberCLIServeOptions: [
    'port', 'host', 'proxy',
    'insecure-proxy', 'watcher',
    'live-reload','live-reload-host',
    'live-reload-port','environment',
    'output-path','ssl','ssl-key',
    'ssl-cert'
  ],

  spawnEmberCLIProcess: function(commandOptions, rawArgs) {
    var emberCLIProcess;
    var emberCLIGenerator = new EmberCLIProcessGenerator();
    var emberCLIArgs      = this.normalizeEmberCLIArgs(commandOptions, rawArgs);
    return emberCLIGenerator.generate({ processArgs: emberCLIArgs });
  },

  normalizeEmberCLIArgs: function(commandOptions, rawArgs) {
    var args = ['serve'];
    var cliOptions = {}

    for(var optionName in commandOptions) {
      if(this.emberCLIServeOptions.indexOf(optionName) < 0 && commandOptions[optionName] == null) { continue; }
      cliOptions[optionName] = commandOptions[optionName];
    }

    var emberCLIOptions = assign({}, this.config['emberCLI'], cliOptions);

    for(var optionName in emberCLIOptions) {
      var cliArgName  = '--' + optionName;
      var cliArgValue = emberCLIOptions[optionName];
      args.push(cliArgName);
      if(cliArgValue === true) { continue; }
      args.push(cliArgValue);
    }

    return args;
  },

  normalizeSepiaArgs: function(commandOptions, rawArgs) {
    return [];
  },

  spawnSepiaProcess: function(commandOptions, rawArgs) {
    var sepiaArgs = this.normalizeSepiaArgs(commandOptions, rawArgs);
    var sepiaConfig = this.config['sepia'];
    var sepiaENV  = safeSetProperties({}, {
      "port":             commandOptions['sepiaPort'] || sepiaConfig['port'],
      "fixtureDir":       commandOptions['fixtures']  || sepiaConfig['fixtureDir'],
      "APIServersConfig": this.config['APIServers'],
      "sepiaOptions":     sepiaConfig['sepiaOptions'],
      "proxyOptions":     sepiaConfig['proxyOptions']
    });
    sepiaENV = assign({ SEPIA: sepiaENV }, process.env)
    var sepiaGenerator = new SepiaProcessGenerator();
    return sepiaGenerator.generate(sepiaArgs, { env: sepiaENV  });
  },

  createMasterProxy: function(port, emberPort, sepiaPort) {
    var proxyAttrs = safeSetProperties({}, {
      'port':         port || this.config['main']['port'],
      'emberPort':    emberPort || this.config['emberCLI']['port'],
      'sepiaPort':    sepiaPort || this.config['sepia']['port'],
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
    this.supervisor     = new Supervisor();
    this.masterProxy    = this.createMasterProxy(commandOptions['mainPort'], commandOptions['port'], commandOptions['sepiaPort']);
    var emberCLIProcess = this.spawnEmberCLIProcess(commandOptions, rawArgs);
    var sepiaProcess    = this.spawnSepiaProcess(commandOptions, rawArgs);
    supervisor.watchProcess('ember-cli', emberCLIProcess);
    supervisor.watchProcess('sepia', sepiaProcess);
    attachProcessListeners(this.supervisor);
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
