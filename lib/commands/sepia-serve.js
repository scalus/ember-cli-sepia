var Supervisor      = require('../supervisor');
var MasterProxy     = require('../proxies/master');
var SepiaProcessGenerator = require('../subprocesses/sepia');
var EmberCLIProcessGenerator = require('../subprocesses/ember-cli');

var supervisor  = new Supervisor();
var masterProxy = new MasterProxy();
var sepiaGenerator    = new SepiaProcessGenerator();
var emberCLIGenerator = new EmberCLIProcessGenerator();

// get ember commands
var emberCLIProcess;
var emberCLIArgs = process.argv.slice(2);
console.log('ember cli args', emberCLIArgs);

if(emberCLIArgs.length > 0) {
  emberCLIProcess = emberCLIGenerator.generate({ processArgs: emberCLIArgs });
} else {
  emberCLIProcess = emberCLIGenerator.generate();
}

supervisor.watchProcess('ember-cli', emberCLIProcess);

supervisor.watchProcess('sepia', sepiaGenerator.generate());


supervisor.on('error', function(error) {
  console.log('There was an error in a the ' + this.title +' child process, exiting');
  supervisor.killAll('SIGTERM');
  throw error;
});

supervisor.on('data', function(data) {
  console.log('process got data: ', this);
  console.log(this.title, ': ', data.toString());
});

supervisor.on('close', function(code) {
  console.log(this.title, ': exited with code ' + code);
});

// SIGTERM AND SIGINT will trigger the exit event.
process.once("SIGTERM", function () {
  process.exit(0);
});
process.once("SIGINT", function () {
  process.exit(0);
});
// And the exit event shuts down the child.
process.once("exit", function () {
  console.log('Shutting down Ember CLI, Sepia, and Master Proxy...');
  supervisor.killAll('SIGINT');
});

process.on('error', function(error) {
  console.log('there was a problem in the main process');
  supervisor.killAll('SIGTERM');
  throw error;
});

masterProxy.start();
