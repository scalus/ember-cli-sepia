#!/usr/bin/env node
var SepiaProxy = require('../proxies/sepia');
var nopt       = require('nopt');
var path       = require('path');

var knownOptions = {
  'sepiaPort': [Number, null],
  'fixtures':  [String],
  'sepiaConfigFile': [path, null],
  'vcrMode': [String, null]
};

var parsedOptions = nopt(knownOptions, {}, process.argv, 2)
var configPath = parsedOptions['sepiaConfigFile'] || '../sepia-config';
var config = require(configPath);

process.env.VCR_MODE = parsedOptions['vcrMode'];

var proxy = new SepiaProxy({
  port: parsedOptions['sepiaPort'] || config['sepia']['port'],
  fixtureDir: parsedOptions['fixtures'] || config['sepia']['fixtureDir'],
  APIServersConfig: config['APIServers'],
  sepiaOptions: config['sepia']['sepiaOptions']
});

proxy.start();
