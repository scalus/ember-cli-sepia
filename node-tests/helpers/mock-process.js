var CoreObject   = require('core-object');
var EventEmitter = require('events').EventEmitter;

var BaseMockProcess = CoreObject.extend({
  title: '',
  isKilled: false,
  kill: function(signal) {
    this.isKilled   = true;
    this.killedWith = signal;
  }
});

eproto = EventEmitter.prototype
module.exports = BaseMockProcess.extend({
  domain: undefined,
  _events: undefined,
  _maxListeners: undefined,
  setMaxListeners: eproto.setMaxListeners,
  emit: eproto.emit,
  addListener: eproto.addListener,
  on: eproto.addListener,
  once: eproto.once,
  removeListener: eproto.removeListener,
  removeAllListeners: eproto.removeAllListeners,
  listeners: eproto.listeners
});
