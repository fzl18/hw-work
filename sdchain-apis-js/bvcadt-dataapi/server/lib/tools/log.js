const path = require('path');
const winston = require('winston');
const tools = require('./tools');

module.exports.init = function (type) {
    if (!type) {
        type = 'common';
    }
    let logConfig = gConfig.logger[type];
    let dirname = logConfig.dirname;
    let filename = logConfig.filename;
    let consoleLevel = logConfig.level;
    tools.mkdir(path.join(dirname, filename));
    return new (winston.Logger)({
        transports: [
            new (winston.transports.File)(logConfig),
            new winston.transports.Console({ level: consoleLevel }),
        ]
    });
}
