function Supervisor() {
  this.processMap = {};
  this.processes  = [];
  this.processEventListeners = {};
}

Supervisor.prototype.syncChildListeners = true;

Supervisor.prototype.watchProcess = function(title, childProcess) {
  childProcess.title = title;
  this.processMap[childProcess.title] = childProcess;
  this.processes.push(childProcess);

  if(this.syncChildListeners) {
    for(var eventName in this.processEventListeners) {
      var listenerArray = this.processEventListeners[eventName];
      listenerArray.foreach(function(listener){
        childProcess.addListener(eventName, listener);
      });
    }
  }

  return childProcess;
}

Supervisor.prototype.getProcess = function(title) {
  return this.processMap[title];
};

Supervisor.prototype.killAll = function(signal) {
  this.processes.forEach(function(childProcess) {
    childProcess.kill(signal);
  });
};

Supervisor.prototype.killProcess = function(processName, signal) {
  var childProcess = this.getProcess(processName);
  if(childProcess) { childProcess.kill(signal); }
};

Supervisor.prototype.addListener = function(eventName, listener) {
  if(!this.processEventListeners[eventName]) {
    this.processEventListeners[eventName] = [];
  }
  var listenerArray = this.processEventListeners[eventName];
  if(listenerArray.indexOf(listener) < 0) {
    listenerArray.push(listener);
    this.processes.forEach(function(childProcess) {
      childProcess.addListener(eventName, listener.bind(childProcess));
    });
  }

  return this;
};

Supervisor.prototype.on = Supervisor.prototype.addListener;

Supervisor.prototype.removeListener = function(eventName, listener) {
  if(!this.processEventListeners[eventName]) { return this; }
  var listenerArray = this.processEventListeners[eventName];
  var listenerIndex = listenerArray.indexOf(listener);

  if(listenerIndex < 0) { return this; }

  listenerArray.splice(listenerIndex, 1);

  this.processes.forEach(function(childProcess) {
    childProcess.removeListener(eventName, listener);
  });

  return this;
}

Supervisor.prototype.off = Supervisor.prototype.removeListener;

// once
// removeAllListeners

module.exports = Supervisor;
