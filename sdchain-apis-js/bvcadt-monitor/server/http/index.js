'use strict'
const Koa = require('koa')
const koaStatic = require('koa-static')
const koaBodyparser = require('koa-bodyparser')
const koaJson = require('koa-json')
const Routes = require('./routes')
const middleware = require('../lib/middleware')
let logger;
// 初始化服务
class Server {
  constructor(config) {
    this.gConfig = config;
    this.port = config.http.port
    this.staticDir = config.http.staticDir
    logger = config.gLogger;
  }

  start() {
    const app = new Koa()
    this.app = app
    const router = new Routes(this.gConfig).router()

    app.on('error', err => {
      console.error('server error', err)
    })
    app
      .use(router.allowedMethods())
      .use(middleware.responseHeaderHandler(this.gConfig))
      .use(koaStatic(this.staticDir))
      .use(koaBodyparser())
      .use(koaJson())
      .use(middleware.requestHandler(this.gConfig))
      .use(middleware.responseHandler(this.gConfig))
      .use(router.routes())


    app.listen(this.port)
    logger.info('Start http server on ' + this.port)
  }
}

module.exports = Server
