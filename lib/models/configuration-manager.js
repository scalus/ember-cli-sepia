var CoreObject = require('core-object');
var fs         = require('fs');
var path       = require('path');
var assign     = require('lodash/object/assign');
var objGet     = require('lodash/object/get');
var objSet     = require('lodash/object/set');
var fileExists = require('../utils/file-exists');

var ConfigurationManager = CoreObject.extend({
  systemConfigPath:  path.resolve(__dirname, '../../config/sepia'),

  defaultConfigPath: path.resolve(process.cwd(), 'config/sepia'),

  _config: {},

  commandOptionsMap: {
    'mainPort':  'main.port',
    'fixtures':  'sepia.fixtures',
    'sepiaPort': 'sepia.port'
  },

  init: function(commandOptions) {
    this.set('vcrMode', process.env.VCR_MODE || commandOptions['vcrMode']);
    this._config = this._loadConfig(commandOptions['sepiaConfigFile']);
    this._mapCommandOptions(commandOptions);
  },

  get: function(key) {
    return objGet(this._config, key);
  },

  set: function(key, value) {
    objSet(this._config, key, value);
    return value;
  },

  _loadConfig: function(configPath) {
    var userConfigPath = this._getUserConfigPath(configPath);
    var userConfig     = userConfigPath ? require(userConfigPath) : {};
    var systemConfig   = require(this.systemConfigPath);
    return assign({}, systemConfig, userConfig);
  },

  // needs to store ember cli options for test or serve somehow
  _mapCommandOptions: function(commandOptions) {

  },

  _getUserConfigPath: function(configPath) {
    var userSpecifiedConfig = path.resolve(configPath);
    console.log('user specified', userSpecifiedConfig)
    if(fileExists(userSpecifiedConfig + '.js')) {
      console.log('user specified found')
      return userSpecifiedConfig;
    } else {
      console.log('user specified not found')
      return fileExists(this.defaultConfigPath + '.js') ? this.defaultConfigPath : undefined;
    }
  }
});

module.exports = ConfigurationManager;
