// this will become the actual command used to start the sepia server
// does not currently work
module.exports = {
  name: 'sepia-serve',
  description: 'starts sepia and ember cli and proxies to each accordingly',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development', aliases: ['e',{'dev' : 'development'}, {'prod' : 'production'}] },
    { name: 'vcr-mode', type: String, default: '', aliases: [{'v-rec': 'record'}, {'v-cache': 'cache'}, {'v-play': 'playback'}] },
    { name: 'port', type: Number, default: 4200, aliases: ['p'] },
    { name: 'sepia-config-file', type: String, default: 'config/sepia-config.js' }
    // probably have to support ember serve options and proxy them to ember cli
  ],

  run: function(commandOptions, rawArgs) {
    // die if no vcr-mode
  }
}
