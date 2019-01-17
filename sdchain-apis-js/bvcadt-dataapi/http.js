'use strict';
const mongoose = require('mongoose');
const config = require('./config/config');
const constants = require('./server/lib/tools/constants');
const configHttp = require('./config/config_http');
const Log = require('./server/lib/tools/log');
const errorCode = require('./server/lib/tools/errorCode');
for (let k in configHttp) {
    config[k] = configHttp[k];
}
global.gConfig = config;
global.gLog = Log.init();
global.gErrorCode = errorCode;
global.gConstants = constants;

//var args = process.argv.splice(2);

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, config.mongodbOpts, function (error) {
    if (!error) {
        gLog.info('mongodb connect success!');
    } else {
        gLog.info('mongodb connect error! - ' + error);
    }
});

const HttpServer = require('./server').HttpServer;
const httpServer = new HttpServer();
httpServer.start();