var chai        = require('chai');
var sinon       = require('sinon');
var sinonChai   = require("sinon-chai");
var Supervisor  = require('../../lib/models/supervisor');
var MockProcess = require('../helpers/mock-process');
var expect      = chai.expect;
chai.use(sinonChai);

describe('Supervisor', function() {
  var supervisor, testProcess, testProcess2, testProcesses;

  var SIGTERM = 'SIGTERM';
  var SIGINT  = 'SIGINT';
  var TABLE_FLIP = '(╯°□°）╯︵ ┻━┻';

  function expectEveryProcess(callback) {
    var outcome = testProcesses.every(callback);
    expect(outcome).to.be.true
  }

  beforeEach(function() {
    testProcess   = new MockProcess({ title: 'tester' });
    testProcess2  = new MockProcess({ title: 'test process 2' });
    testProcesses = [testProcess, testProcess2];
    supervisor   = new Supervisor({
      processMap: { "tester": testProcess }
    });
  });

  afterEach(function() {
    supervisor.destroy();
  });

  describe('initialization', function() {
    it('adds processes to the processMap on initialization', function() {
      expect(supervisor.processMap['tester']).to.equal(testProcess);
    });
  });

  describe('#watchProcess', function() {
    it('mutates the process title', function() {
      supervisor.watchProcess(TABLE_FLIP, testProcess2);
      expect(testProcess2.title).to.equal(TABLE_FLIP);
    });

    it('places it in the processMap, keyed by process title', function(){
      var title = testProcess2.title;
      supervisor.watchProcess(title, testProcess2);
      expect(supervisor.processMap[title]).to.equal(testProcess2)
    });

    describe('events with syncChildListeners', function() {
      it('should attach previous listeners to newly watched processes');
    });

    describe('events without syncChildListeners', function() {
      it('should not attach previous listeners to newly watched processes');
    });
  });

  describe('#getProcess', function() {
    it('returns the process based on process title', function() {
      expect(supervisor.getProcess(testProcess.title)).to.equal(testProcess);
    });
  });

  describe('#forEachProcess', function() {
    beforeEach(function() {
      supervisor.watchProcess(TABLE_FLIP, testProcess2);
    });

    it('should perform a function on each process', function() {
      supervisor.forEachProcess(function(childProcess) {
        childProcess.rox = true;
      });
      expectEveryProcess(function(childProcess) {
        return childProcess.rox;
      });
    });
  });

  describe('#killProcess', function() {
    it('kills a process by process title', function() {
      supervisor.killProcess('tester', 'SIGTERM');
      expect(testProcess.isKilled).to.be.true
    });

    it('kills a process with the given signal', function() {
      supervisor.killProcess('tester', 'SIGTERM');
      expect(testProcess.killedWith).to.equal('SIGTERM')
    });
  });

  describe('#killAll', function() {
    beforeEach(function() {
      var title = testProcess2.title;
      supervisor.watchProcess(title, testProcess2);
    });

    it('kills all processes', function() {
      supervisor.killAll(SIGTERM);
      expectEveryProcess(function(childProcess) {
        return childProcess.isKilled;
      });
    });

    it('kills all processes with a given signal', function() {
      supervisor.killAll(SIGTERM);
      expectEveryProcess(function(childProcess) {
        return childProcess.killedWith === SIGTERM;
      });
    });
  });

  describe('#on / #addListener', function() {
    var dataSpy, mockData;

    beforeEach(function() {
      dataSpy  = sinon.spy();
      mockData = { language: 'español' };
    });

    it('#on should attach a listener to childProcesses', function() {
      supervisor.on('data', dataSpy);
      testProcess.emit('data', mockData);
      expect(dataSpy).to.have.been.calledWith(mockData);
    });

    it('#addListener should attach a listener to childProcesses', function() {
      supervisor.addListener('data', dataSpy);
      testProcess.emit('data', mockData);
      expect(dataSpy).to.have.been.calledWith(mockData);
    });

    it('adds the listener to the processEventListeners array', function() {
      supervisor.on('data', dataSpy);
      expect(supervisor.processEventListeners['data']).to.contain(dataSpy)
    });

    it.skip('will only add the listener once', function() {
      supervisor.on('data', dataSpy);
      supervisor.on('data', dataSpy);
      expect(supervisor.processEventListeners['data']).to.have.length(1);
    });
  });
});
