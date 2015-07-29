var path      = require('path');
var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var ConfigurationManager = require('../../lib/models/configuration-manager');
var expect = chai.expect;

chai.use(sinonChai);

// mocks
var originalDefaultConfigPath = ConfigurationManager.prototype.defaultConfigPath;
var fakeConfigPath = path.resolve(__dirname, '../fixtures/fake-config');
var fakeDefaultUserPath = path.resolve(__dirname, '../fixtures/default-user-config');
var fakeDefaultUserConfig = require(fakeDefaultUserPath);
var fakeConfig     = require(fakeConfigPath);
var systemConfig   = require(path.resolve('./config/sepia'));

describe('ConfigurationManager', function() {
  var configManager;

  describe('#init', function() {
    describe('with a specified configFile', function() {
      var fixturePath = 'these/are/not/the/fixtures/you/are/looking/for';

      beforeEach(function() {
        configManager = new ConfigurationManager({
          'sepiaConfigFile': fakeConfigPath,
          'fixtures': fixturePath,
          'environment': 'test'
        });
      });

      it('loads the config correctly and overwrites systemConfig', function() {
        var port = fakeConfig['emberCLI']['port'];
        expect(configManager.get('emberCLI.port')).to.equal(port);
      });

      it('preserves systemConfig as defaults', function() {
        var mainPort = systemConfig['main']['port'];
        expect(configManager.get('main.port')).to.equal(mainPort);
      });

      it('assigns command line options highest precedence', function() {
        expect(configManager.get('sepia.fixtures')).to.equal(fixturePath);
      });

      it('recognizes ember cli command line args and sets the correct path', function() {
        expect(configManager.get('emberCLI.environment')).to.equal('test');
      });
    });

    describe('with a config file in the assumed path of defaultConfigPath', function() {
      var fixturePath = 'these/are/not/the/fixtures/you/are/looking/for';

      beforeEach(function() {
        // mock the user config
        ConfigurationManager.prototype.defaultConfigPath = fakeDefaultUserPath;
        configManager = new ConfigurationManager({
          'fixtures': fixturePath,
          'environment': 'test'
        });
      });

      afterEach(function() {
        ConfigurationManager.prototype.defaultConfigPath = originalDefaultConfigPath;
      });

      it('loads the config correctly and overwrites systemConfig', function() {
        var mainPort = fakeDefaultUserConfig['main']['port'];
        expect(configManager.get('main.port')).to.equal(mainPort);
      });

      it('preserves systemConfig as defaults', function() {
        var port = systemConfig['emberCLI']['port'];
        expect(configManager.get('emberCLI.port')).to.equal(port);
      });

      it('assigns command line options highest precedence', function() {
        expect(configManager.get('sepia.fixtures')).to.equal(fixturePath);
      });

      it('recognizes ember cli command line args and sets the correct path', function() {
        expect(configManager.get('emberCLI.environment')).to.equal('test');
      });
    });
  });

  describe('#get', function() {
    it('should get value out of this._config', function() {
      configManager = new ConfigurationManager
      var path  = 'testValue';
      var value = 100;
      configManager._config[path] = value
      expect(configManager.get(path)).to.equal(value);
    });
  });

  describe('#set', function() {
    it('should set values on this._config', function() {
      configManager = new ConfigurationManager
      var path  = 'testValue';
      var value = 100;
      configManager.set(path, value)
      expect(configManager._config[path]).to.equal(value);
      expect(configManager.get(path)).to.equal(value);
    });
  });
});
