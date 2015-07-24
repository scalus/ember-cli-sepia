#!/usr/bin/env node
var SepiaProxy = require('../proxies/sepia');
var nopt       = require('nopt');
var path       = require('path');

var knownOptions = {
  'sepia-port': [Number, null],
  'fixtures':  [String],
  'sepia-config-file': [path, null],
  'vcr-mode': [String, null]
};

function loadConfig(configPath) {
  // cannot have config inside directory called undefined
  if(/undefined/.test(configPath)) {
    configPath = '../sepia-config';
  }
  return require(configPath);
}

var parsedOptions = nopt(knownOptions, {}, process.argv, 2)
var config = loadConfig(parsedOptions['sepia-config-file']);

process.env.VCR_MODE = parsedOptions['vcr-mode'] || 'playback';

var proxy = new SepiaProxy({
  port: parsedOptions['sepia-port'] || config['sepia']['port'],
  fixtureDir: parsedOptions['fixtures'] || config['sepia']['fixtureDir'],
  APIServersConfig: config['APIServers'],
  sepiaOptions: config['sepia']['sepiaOptions']
});

proxy.start();
