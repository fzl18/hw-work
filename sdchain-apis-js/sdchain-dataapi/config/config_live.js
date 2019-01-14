const path = require('path');

const logpath = path.join(path.dirname(__dirname), 'logs');

const config = {
    ledger_index: 0,
    errorLogInterval:30*60*1000,
    logger: {
        common: {
            level: 'debug',
            maxFiles: 100,
            maxsize: 1000 * 1000 * 10,
            json: false,
            dirname: logpath,
            //filename: 'live_' + new Date().getTime() + '.log',
            filename: 'live.log',
            timestamp: function () {
                var nowDate = new Date();
                var result = nowDate.toLocaleDateString() + " " + nowDate.toLocaleTimeString();
                return result;
            },
            formatter: function (options) {
                return options.timestamp() + ' [' + options.level.toUpperCase() + ']: ' + options.message;
            }
        }
    }
};
module.exports = config;