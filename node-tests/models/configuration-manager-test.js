var path      = require('path');
var chai      = require('chai');
var sinon     = require('sinon');
var sinonChai = require('sinon-chai');
var ConfigurationManager = require('../../lib/models/configuration-manager');
var expect = chai.expect;

chai.use(sinonChai);

// mocks
var fakeConfigPath = path.resolve(__dirname, '../fixtures/fake-config');
var fakeConfig = require(fakeConfigPath);

describe('ConfigurationManager', function() {
  var configManager;


  describe('#init', function() {
    describe('with a specified configFile', function() {

      beforeEach(function() {
        configManager = new ConfigurationManager({ 'sepiaConfigFile': fakeConfigPath });
      });

      it('loads the config correctly and overwrites systemConfig', function() {
        var port = fakeConfig['emberCLI']['port'];
        console.log(fakeConfig);
        expect(configManager.get('emberCLI.port')).to.equal(port);
      });

      it('preserves systemConfig as defaults', function() {
        configManager.get('')
      });
    });
    // describe('with a config file in the assumed path of config/sepia');
    // describe('with command line options');
  });

  // describe('#get', function() {
  //
  // });
  //
  //
  // describe('#set', function() {
  //
  // });
});
