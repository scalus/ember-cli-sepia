Ember CLI Sepia
================================================================================

Recording and play back HTTP requests to your API servers for your Ember CLI App

An Ember CLI integration into [Sepia.js][sepia].

WARNING - Use this with caution
--------------------------------------------------------------------------------

This is very much still tied to how our own app works and we are missing a few
key features that would allow any project to hook into this addon. If you decide
to use this, feel free to hack on it and contribute back.

Commands
--------------------------------------------------------------------------------

Both `sepia:serve` and `sepia:test` are what I call delegating commands. The way
they work is that they run some internal commands that will do things like start
sepia. Then they delegate to their respective vanilla ember command like
`ember serve` or `ember test`.

### `ember sepia:serve`

This starts up several processes, including:

* Master Proxy (entry point into your app)
* Ember Server via `ember serve`
* Sepia Proxy

Your main entry point will be Master Proxy, which is in charge of routing HTTP
Requests to either the Ember CLI Server or the Sepia Server.

When developing, use the Master Proxy server as the entry point to using your app.

From there, Sepia Proxy will decide whether to proxy to your API servers or
respond with a recorded request.

Here is a rough diagram of how it works:

![Sepia Serve Diagram](https://raw.githubusercontent.com/backopsco/ember-cli-sepia/master/assets/sepia-serve-edited.jpg?token=ACHuLDiuPqDIwN0-hboFM63ZOlfj7NuJks5Vy636wA%3D%3D)

#### Options

Supports all options of `ember serve`

##### `--main-port` (Number)
Aliases: `--mp`

Main Port to use as the entry point to your app, and should be used as if you
used `ember serve --port XXXX`. This is the port the Master Proxy is started on.


##### `--vcr-mode` (String) {record, cache, playback}
Aliases: `--v-rec`: `--vcr-mode=record`, `v-cache`: `--vcr-mode=cache`, `v-play`: `--vcr-mode=playback`

Sepia Equivalent: `VCR_MODE` Environment Variable: [See Sepia VCR Mode][sepia-mode]


##### `--sepia-config-file` (String)
Default: `config/sepia`

File that Ember CLI Sepia will use as your configuration file. Do not pass in the
file extension, as it assumes it to be `.js`. `json` may be supported in the future.

More details on how this configuration file can be used is provided below.


##### `--fixtures` (String)
Default: `sepia-fixtures`

Sepia Equivalent: `sepia.fixtureDir(<path>)` [See sepia#fixtureDir][sepia-fixtures]

Directory where sepia will be storing your fixtures.


##### `--sepia-port` (Number)
Aliases: `--sp`

This port is used as the Sepia Proxy port. We will spin up a proxy server that
will proxy to your default API server if in record or cache mode. If in playback
mode, sepia will throw an error.


### `ember sepia:test`

At the simplest level, this runs `ember test` but with a proxy middleware added
to testem that will send requests to the the sepia proxy if it has a url that
matches an api server (right now thats if it matches the regex /api\//)

#### Options

Supports all options of `ember test`

##### `--vcr-mode` (String) {record, cache, playback}
Default: playback
Aliases: `--v-rec`: `--vcr-mode=record`, `v-cache`: `--vcr-mode=cache`, `v-play`: `--vcr-mode=playback`

Sepia Equivalent: `VCR_MODE` Environment Variable: [See Sepia VCR Mode][sepia-mode]


##### `--sepia-config-file` (String)
Default: `config/sepia`

File that Ember CLI Sepia will use as your configuration file. Do not pass in the
file extension, as it assumes it to be `.js`. `json` may be supported in the future.

More details on how this configuration file can be used is provided below.

##### `--fixtures` (String)
Default: `sepia-fixtures`

Sepia Equivalent: `sepia.fixtureDir(<path>)` [See sepia#fixtureDir][sepia-fixtures]

Directory where sepia will be storing your fixtures.

##### `--sepia-port` (Number)
Aliases: `--sp`

This port is used as the Sepia Proxy port. We will spin up a proxy server that
will proxy to your default API server if in record or cache mode. If in playback
mode, sepia will throw an error.

Configuration Options
--------------------------------------------------------------------------------

### main

Example:
```json
  "main": {
    "port": 3000,
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  }
```

#### port

Port that the master proxy will run on. Can be overridden by the command line
option

#### proxyOptions

Options passed to `httpProxy.createProxyServer(options)`.

See [Node HTTP Proxy][node-http-proxy]

### sepia

Example:
```json
  "sepia": {
    "port": 5000,
    "fixtures": "sepia-fixtures",
    "sepiaOptions": {
      "verbose": false,
      "debug":   false,
      "includeHeaderNames": false,
      "includeCookieNames": false,
      "filters": []
    },
    "proxyOptions": {
      "ws": true,
      "changeOrigin": true,
      "autoRewrite":  true
    }
  }
```

#### port

Port that the sepia proxy will run on. Can be overridden by the command line
option

#### fixtures
fixture directory path passed to `sepia.fixtureDir(path)`.

See [sepia#fixtureDir][sepia-fixtures]

#### sepiaOptions

Options passed to `sepia.configure(options)`.

See [sepia#configure][sepia-configure]

#### proxyOptions

Options passed to `httpProxy.createProxyServer(options)`.

See [Node HTTP Proxy][node-http-proxy]

### APIServers

Example:
```json
  "APIServers": {
    "default": {
      "port": 4000
    }
  }
```

This option is a hash of API Servers. The key name should be the name of the server

`default` server: by default, this is the server that sepia will proxy to.

Default Server is the only one supported currently.

#### port

port that the server will be serving on. This is nested under the server name key

Installation
--------------------------------------------------------------------------------

* `npm install ember-cli-sepia --save`

Running
--------------------------------------------------------------------------------

See Commands above

Running Tests
--------------------------------------------------------------------------------

* `npm test`
* `npm run autotest` - watch + run


For more information on using ember-cli, visit [http://www.ember-cli.com/][ember-cli].

[ember-cli]: http://www.ember-cli.com/
[sepia]: https://github.com/linkedin/sepia
[sepia-mode]: https://github.com/linkedin/sepia#vcr-modes
[sepia-fixtures]: https://github.com/linkedin/sepia#vcr-modes
[sepia-configure]: https://github.com/linkedin/sepia#configure
[node-http-proxy]: https://github.com/nodejitsu/node-http-proxy#options
