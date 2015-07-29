var CoreObject = require('core-object');

function addListener(eventName, listener) {
  if(!this.processEventListeners[eventName]) {
    this.processEventListeners[eventName] = [];
  }
  var listenerArray = this.processEventListeners[eventName];
  if(listenerArray.indexOf(listener) < 0) {
    listenerArray.push(listener);
    this.forEachProcess(function(childProcess) {
      childProcess.addListener(eventName, listener);
    });
  }

  return this;
};

 function removeListener(eventName, listener) {
  if(!this.processEventListeners[eventName]) { return this; }
  var listenerArray = this.processEventListeners[eventName];
  var listenerIndex = listenerArray.indexOf(listener);

  if(listenerIndex < 0) { return this; }

  listenerArray.splice(listenerIndex, 1);

  this.forEachProcess(function(childProcess) {
    childProcess.removeListener(eventName, listener);
  });

  return this;
}

var Supervisor = CoreObject.extend({

  syncChildListeners: true,
  processMap: {},
  processEventListeners: {},
  logLevel: process.env.SUPERVISOR_LOG_LEVEL,

  init: function(attrs) {
    if(!attrs) {
      this.attachDefaultListeners();
      this._super();
      return;
    }

    // only auto assign select attrs
    if(attrs.syncChildListeners) {
      this._super({ syncChildListeners: attrs.syncChildListeners });
    } else {
      this._super();
    }

    if(attrs.processMap) {
      for(var processTitle in attrs.processMap) {
        var childProcess = attrs.processMap[processTitle];
        this.watchProcess(processTitle, childProcess);
      }
    }
    this.attachDefaultListeners();
  },

  getProcess: function(title) {
    return this.processMap[title];
  },

  watchProcess: function(title, childProcess) {
    childProcess.title = title;
    this.processMap[childProcess.title] = childProcess;

    if(!this.syncChildListeners) { return childProcess; }

    for(var eventName in this.processEventListeners) {
      var listenerArray = this.processEventListeners[eventName];
      listenerArray.forEach(function(listener){
        childProcess.addListener(eventName, listener);
      });
    }

    return childProcess;
  },

  killAll: function(signal) {
    this.forEachProcess(function(childProcess){
      childProcess.kill(signal)
    });
  },

  killProcess: function(processTitle, signal) {
    var childProcess = this.getProcess(processTitle);
    if(childProcess) { return childProcess.kill(signal); }
  },

  forEachProcess: function(callback) {
    for(var processTitle in this.processMap) {
      var childProcess = this.processMap[processTitle];
      callback(childProcess)
    }
  },

  attachDefaultListeners: function() {
    supervisor = this;
    //this might be a memory leak
    this.on('error', function(error) {
      supervisor._error('There was an error in a the', this.title, 'child process, exiting');
      supervisor.killAll('SIGTERM');
      throw error;
    });

    this.on('data', function(data) {
      supervisor._debug('process got data: ', this);
      supervisor._debug(this.title + ':', data.toString());
    });

    this.on('close', function(code) {
      supervisor._debug(this.title + ':', 'exited with code', code);
    });
  },

  // mimics event emitter API
  addListener:    addListener,
  on:             addListener,
  removeListener: removeListener,
  off:            removeListener,
  // once
  removeAllListeners: function(eventName) {
    if(eventName) { return this._removeAllListeners(eventName); }
    for(var eventType in this.processEventListeners) {
      this._removeAllListeners(eventType);
    }
    return this;
  },

  destroy: function() {
    this.removeAllListeners();
    this.killAll('SIGTERM');
    this.processMap = {};
    this.processEventListeners = {};
  },

  _removeAllListeners: function(eventName) {
    this.processEventListeners[eventName] = [];
    this.forEachProcess(function(childProcess) {
      childProcess.removeAllListeners(eventName);
    });
    return this;
  },
  // should replace this with more robust debuging
  _debug: function() {
    if(!this.logLevel || this.logLevel === Supervisor.LOG_LEVEL.DEBUG) {
      console.log.apply(console, arguments);
    }
  },
  _error: function() {
    console.error.apply(console, arguments)
  }
});

Supervisor.LOG_LEVEL = {
  ERROR: 'error',
  WARN:  'warn',
  DEBUG: 'debug'
};

module.exports = Supervisor;
