#!/usr/bin/env node
var SepiaProxy = require('../proxies/sepia');

process.on('messsage', function (message) {
  if(message.type === 'start' && !process.env.sepiaProxy) {
    process.env.sepiaProxy = SepiaProxy.start(message.options);
  }
});
