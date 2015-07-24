module.exports = {
  server: {
    port: 4000
    // some sort of function that returns what server to proxy to
    urlFilter: function(url) {
      return /api/.test(url);
    },
    proxyOptions: {}
  },

  sepiaProxy: {
    fixturePath: 'tests/sepia-fixtures',
    port: 5000,
    // supports all sepia options
    sepiaOptions: {
      verbose: true,
      debug: true
    },
    // supports all node-http-proxy options
    proxyOptions: {}
  },

  emberCLI: {
    port: 4200
  }

  // api server that sepia will be proxying to
  APIServers: {
    "default": {
      host: 'localhost',
      urlFilter: /api/;
      port: 3000
    },
  }
}
