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
    commandOptions = commandOptions || {};
    this._super();
    this.set('vcrMode', process.env.VCR_MODE || commandOptions['vcrMode']);
    this._config = this.loadConfig(commandOptions);
  },

  get: function(key) {
    return objGet(this._config, key);
  },

  set: function(key, value) {
    objSet(this._config, key, value);
    return value;
  },

  loadConfig: function(commandOptions) {
    var config = this._loadConfig(commandOptions['sepiaConfigFile']);
    var commandLineConfig = transformCommandOptions(commandOptions, this.commandOptionsMap);
    var mergedConfig = merge(config, commandLineConfig)
    return mergedConfig;
  },

  _loadConfig: function(configPath) {
    var userConfigPath = this._getUserConfigPath(configPath);
    var userConfig     = userConfigPath ? require(userConfigPath) : {};
    var systemConfig   = require(this.systemConfigPath);
    var mergedConfig   = merge({}, systemConfig, userConfig)
    return mergedConfig;
  },

  _getUserConfigPath: function(configPath) {
    if(configPath && fileExists(path.resolve(configPath) + this.configExtenstion)) {
      return path.resolve(configPath);
    } else {
      return this._getAssumedUserConfigPath();
    }
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
