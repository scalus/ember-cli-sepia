var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var unique     = require('lodash/array/uniq');
var merge      = require('lodash/object/merge');
var objGet     = require('lodash/object/get');
var objSet     = require('lodash/object/set');
var EmberCLITestCommand  = require('ember-cli/lib/commands/test');
var EmberCLIServeCommand = require('ember-cli/lib/commands/serve');
var fileExists = require('../utils/file-exists');
var getCommandOptionNames = require('../utils/get-command-option-names');

function getEmberCLICommandOptionsMap() {
  var options = getCommandOptionNames(EmberCLIServeCommand);
  options.concat(getCommandOptionNames(EmberCLITestCommand));
  return unique(options).reduce(function(map, option) {
    var pathKey = 'emberCLI.' + option;
    objSet(map, option, pathKey);
    return map;
  }, {});
}

var commandOptionsMap = merge({
  'mainPort':  'main.port',
  'fixtures':  'sepia.fixtures',
  'sepiaPort': 'sepia.port'
}, getEmberCLICommandOptionsMap());

var ConfigurationManager = CoreObject.extend({
  systemConfigPath:  path.resolve(__dirname, '../../config/sepia'),

  defaultConfigPath: path.resolve(process.cwd(), 'config/sepia'),

  configExtenstion: '.js',

  _config: {},

  commandOptionsMap: commandOptionsMap,

  init: function(commandOptions) {
    this._super();
    this._config = this.loadConfig(commandOptions || {});
  },

  get: function(key) {
    return objGet(this._config, key);
  },

  loadConfig: function(commandOptions) {
    var fileConfig = this._loadConfigFiles(commandOptions['sepiaConfigFile']);
    var commandLineConfig = transformCommandOptions(commandOptions, this.commandOptionsMap);
    var mergedConfig = merge(fileConfig, commandLineConfig)
    mergedConfig.vcrMode = process.env.VCR_MODE || commandOptions['vcrMode'];
    return mergedConfig;
  },

  _loadConfigFiles: function(configPath) {
    var userConfigPath = this._discoverUserConfigPath(configPath);
    var userConfig     = userConfigPath ? require(userConfigPath) : {};
    var systemConfig   = require(this.systemConfigPath);
    var mergedConfig   = merge({}, systemConfig, userConfig);
    if(userConfigPath) {
      mergedConfig.sepiaConfigFile = userConfigPath
    }
    return mergedConfig;
  },

  _discoverUserConfigPath: function(configPath) {
    if(configPath && fileExists(path.resolve(configPath) + this.configExtenstion)) {
      sepiaConfigFile = path.resolve(configPath);
    } else {
      sepiaConfigFile = this._getAssumedUserConfigPath();
    }
    return sepiaConfigFile;
  },

  _getAssumedUserConfigPath: function() {
    return fileExists(this.defaultConfigPath + this.configExtenstion) ? this.defaultConfigPath : undefined;
  }
});

function transformCommandOptions(commandOptions, commandOptionsMap) {
  var config = {};
  for(var optionName in commandOptions) {
    var value = commandOptions[optionName];
    var path  = commandOptionsMap[optionName];
    if(path) { objSet(config, path, value); }
  }
  return config;
}

module.exports = ConfigurationManager;
