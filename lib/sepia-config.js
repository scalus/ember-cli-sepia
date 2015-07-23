module.exports = {
  "main": {
    "port": process.env.PORT || 3000,
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  },

  "emberCLI": {
    "environment": "development",
    "output-path": "dist/",
    "port": process.env.EMBER_PORT || 4200,
    "host": "0.0.0.0",
    "insecure-proxy": false,
    "watcher": "events",
    "live-reload": true,
    "ssl": false,
    "ssl-key":  "ssl/server.key",
    "ssl-cert": "ssl/server.crt"
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
