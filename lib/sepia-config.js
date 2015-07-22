module.exports = {
  "mainServer": {
    "port": 3000,
    "proxyOptions": {}
  },

  "emberCLI": {
    "port": 4200
  },

  "sepia": {
    "port": 5000,
    "fixtureDir": "scalus/sepia-fixtures",
    "sepiaOptions": {
      "verbose": true,
      "debug": true,
      "includeHeaderNames": false,
      "includeCookieNames": false,
      "filters": [{
        urlFilter: function(url) {
          console.log('old url:', url);
          console.log('new url:', url.replace(/localhost/, 'lvh.me'));
          return url.replace(/localhost/, 'lvh.me');
        }
      }]
    },
    "proxyOptions": {}
  },

  "APIServers": {
    "rails": {
      "port": 4000,
      "urlMatcher": "/api/"
    }
  }
}
