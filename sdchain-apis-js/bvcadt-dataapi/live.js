'use strict';
const mongoose = require('mongoose');
const config = require('./config/config');
const constants = require('./server/lib/tools/constants');
const configLive = require('./config/config_live');
const Log = require('./server/lib/tools/log');
const errorCode = require('./server/lib/tools/errorCode');
for (let k in configLive) {
    config[k] = configLive[k];
}
global.gConfig = config;
global.gLog = Log.init();
global.gErrorCode = errorCode;
global.gConstants = constants;

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodb, config.mongodbOpts, function (error) {
    if (!error) {
        gLog.info('mongodb connect success!');
    } else {
        gLog.info('mongodb connect error! - ' + error);
    }
});

const LiveServer = require('./server').LiveServer;
const liveServer = new LiveServer();
liveServer.start();


