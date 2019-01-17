'use strict'
const Routes = require('./routes')
const httpServer = require('../http/');

class Server {
  constructor() {
  }

  start() {
    const server = new httpServer({
        port: gConfig.port,
        staticDir: gConfig.staticDir,
        apiRoot: gConfig.apiRoot,
        routes: Routes
    });
    server.start()
  }
}

module.exports = Server;