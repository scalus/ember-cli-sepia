module.exports = {
  "main": {
    "port": process.env.MAIN_PORT || 3000,
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  },

  "sepia": {
    "port": process.env.SEPIA_PORT || 5000,
    "fixtures": "scalus/sepia-fixtures",
    "sepiaOptions": {
      "verbose": false,
      "debug":   false,
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
