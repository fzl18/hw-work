'use strict'
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBodyparser = require('koa-bodyparser')
const koaJson = require('koa-json')
const requestCors = require('./middleware/requestCors.js')
const requestHandler = require('./middleware/requestHandler.js')
const responseHandler = require('./middleware/responseHandler.js')
class Server {
  constructor(options) {
    this._port = options.port
    this._staticDir = options.staticDir
    this._apiRoot = options.apiRoot
    this._routes = options.routes
  }

  start() {
    const app = new Koa()
    this.app = app
    const router = new this._routes().router()
    app.proxy = true

    app.on('error', err => {
      console.error('server error', err)
    })
    app
      .use(router.allowedMethods())
      .use(koaStatic(this._staticDir))
      .use(koaBodyparser())
      .use(koaJson())
      .use(requestCors())
      .use(requestHandler())
      .use(responseHandler())
      .use(router.routes())

    app.listen(this._port)
    console.log('The server is listening on ' + this._port)
  }
}

module.exports = Server;