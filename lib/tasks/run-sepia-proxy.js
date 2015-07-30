#!/usr/bin/env node
var ConfigurationManager = require('../models/configuration-manager');
var safeSetProperties    = require('../utils/safe-set-properties');
var SepiaProxy = require('../proxies/sepia');
var nopt       = require('nopt');
var path       = require('path');

var knownOptions = {
  'sepia-port': [Number, null],
  'fixtures':  [String],
  'sepia-config-file': [path, null],
  'vcr-mode': [String, null]
};

var parsedOptions = nopt(knownOptions, {}, process.argv, 2)

process.env.VCR_MODE = parsedOptions['vcr-mode'] || 'playback';

// cleanse undefined options
var commandOptions = safeSetProperties({}, {
  vcrMode:   parsedOptions['vcr-mode'],
  sepiaPort: parsedOptions['sepia-port'],
  fixtures:  parsedOptions['fixtures'],
  sepiaConfigFile: parsedOptions['sepia-config-file']
});

var configManager = new ConfigurationManager(commandOptions);

var proxy = new SepiaProxy({
  port: configManager.get('sepia.port'),
  fixtures: configManager.get('sepia.fixtures'),
  APIServersConfig: configManager.get('APIServers'),
  sepiaOptions: configManager.get('sepia.sepiaOptions')
});

proxy.start();
