#!/usr/bin/env node
var SepiaProxy = require('../proxies/sepia');
var proxy = new SepiaProxy(process.env.SEPIA);
proxy.start();
