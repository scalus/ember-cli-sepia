module.exports = {
  "main": {
    "port": process.env.PORT || 3000,
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  },
  // supports all ember CLI options
  // should be camelCased
  "emberCLI": {
    "port": process.env.EMBER_PORT || 4200
  },

  "sepia": {
    "port": process.env.SEPIA_PORT || 5000,
    "fixtureDir": "scalus/sepia-fixtures",
    "sepiaOptions": {
      "verbose": true,
      "debug": true,
      "includeHeaderNames": false,
      "includeCookieNames": false,
      "filters": [{
        urlFilter: function(url) {
          return url.replace(/localhost/, 'lvh.me');
        }
      }]
    },
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  },

  "APIServers": {
    "default": {
      "port": 4000
    }
  }
}
