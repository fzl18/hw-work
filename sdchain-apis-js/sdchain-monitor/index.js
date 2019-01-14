'use strict';
// 初始化配置
const mongoose = require('mongoose');
const config = require('./config/config');
const log = require('./core/log');
const Notice = require('./core/notice');
const LiveServer = require('./server/live');
const HttpServer = require('./server/http');
process.env.UV_THREADPOOL_SIZE = 128;

config.gLogger = log(config.logger);
config.gNotice = new Notice(config.sms);
global.gNodes = config.monitor.nodeList;
global.gApps = config.monitor.appList;
global.gLogger = log(config.logger);
global.gConfig = config;
mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, config.mongodbOpts, function (error) {
    if (!error) {
        config.gLogger.info('mongodb connect success!');
    } else {
        config.gLogger.info('mongodb connect error! - ' + error);
    }
});

const liveServer = new LiveServer(config);
liveServer.start();

const httpServer = new HttpServer(config);
httpServer.start();

//  const rt = await notice.sendsms(null, '18936071792', '节点HK-01异常: 区块高度1024');