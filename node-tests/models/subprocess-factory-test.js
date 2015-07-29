var chai        = require('chai');
var sinon       = require('sinon');
var sinonChai   = require("sinon-chai");
var MockProcess = require('../helpers/mock-process');
var SubprocessFactory = require('../../lib/models/subprocess-factory');
var expect = chai.expect;
chai.use(sinonChai);

describe('SubprocessFactory', function() {
  var subprocessfactory;

  describe('#init', function() {
    var env, title, gid;

    beforeEach(function() {
      env   = { test: true };
      title = 'smash bros';
      gid   = 5555;
      subprocessfactory = new SubprocessFactory({
        title: title,
        spawnOptions: {
          env: env,
          gid: gid,
          fighter: 'Ryu'
        }
      });
    });

    it('assigns only valid spawnOptions', function() {
      expect(subprocessfactory.spawnOptions.env).to.equal(env);
      expect(subprocessfactory.spawnOptions.gid).to.equal(gid);
      expect(subprocessfactory.spawnOptions).to.not.have.property('fighter');
    });

    it('assigns the rest of the options normally', function() {
      expect(subprocessfactory.title).to.equal(title);
    });
  });

  describe.skip('#spawn', function() {
    // mock out _generateProcess to return mock process
    describe('with commandOptions', function() {

    });

    describe('without commandOptions', function() {

    });
  });

  describe('#normalizeArgs', function() {
    var switches = {
      attack:     '--attack',
      weapon:     '--weapon',
      fighter:    '--fighter',
      powerLevel: '--power-level',
      finalSmash: '--final-smash'
    };

    var values = {
      attack:     'Falcon Punch',
      weapon:     'sword',
      fighter:    'Captain Falcon',
      powerLevel: 'over 9000',
      finalSmash: 'hit someone with my race car'
    };

    var validCommands = ['fighter', 'attack', 'finalSmash'];

    function expectSwitchAndValue(resultArray, property) {
      var expectedSwitch = switches[property];
      var expectedValue  = values[property];
      var valueIndex = resultArray.indexOf(expectedSwitch) + 1;
      var value      = resultArray[valueIndex]
      expect(resultArray).to.contain(expectedSwitch);
      expect(value).to.equal(expectedValue);
    }

    function dontExpectSwitchAndValue(resultArray, property) {
      var expectedSwitch = switches[property];
      var expectedValue  = values[property];
      var valueIndex = resultArray.indexOf(expectedSwitch) + 1;
      var value      = resultArray[valueIndex]
      expect(resultArray).to.not.contain(expectedSwitch);
      expect(resultArray).to.not.contain(expectedValue);
    }

    describe('with passed in processOptions and CLI options', function() {
      var result;
      var commandOptions = {
        fighter: values.fighter,
        powerLevel: values.powerLevel
      };

      beforeEach(function() {
        subprocessfactory = new SubprocessFactory({
          validCommandOptions: validCommands,
          processOptions: {
            attack: values.attack,
            weapon: values.weapon
          }
        });
        result = subprocessfactory.normalizeArgs(commandOptions);
      });

      it('allows validCommandOptions to pass through', function() {
        expectSwitchAndValue(result, 'fighter');
        expectSwitchAndValue(result, 'attack');
      });

      it('does not allow invalid command options to pass through', function() {
        dontExpectSwitchAndValue(result, 'powerLevel');
        dontExpectSwitchAndValue(result, 'weapon');
      });
    });

    describe('with passed in processOptions only', function() {
      var result;

      beforeEach(function() {
        subprocessfactory = new SubprocessFactory({
          validCommandOptions: validCommands,
          processOptions: {
            attack: values.attack,
            weapon: values.weapon
          }
        });
        result = subprocessfactory.normalizeArgs({});
      });

      it('allows validCommandOptions to pass through', function() {
        expectSwitchAndValue(result, 'attack');
      });

      it('does not allow invalid command options to pass through', function() {
        dontExpectSwitchAndValue(result, 'weapon');
      });
    });

    describe('with passed in CLI options only', function() {
      var result;
      var commandOptions = {
        fighter: values.fighter,
        powerLevel: values.powerLevel
      };

      beforeEach(function() {
        subprocessfactory = new SubprocessFactory({
          validCommandOptions: validCommands
        });
        result = subprocessfactory.normalizeArgs(commandOptions);
      });

      it('allows validCommandOptions to pass through', function() {
        expectSwitchAndValue(result, 'fighter');
      });

      it('does not allow invalid command options to pass through', function() {
        dontExpectSwitchAndValue(result, 'powerLevel');
      });
    });

    it('when has no processOptions or CLI options', function() {
      subprocessfactory = new SubprocessFactory({
        validCommandOptions: validCommands
      });
      expect(subprocessfactory.normalizeArgs({})).to.be.undefined;
    });
  });
});
