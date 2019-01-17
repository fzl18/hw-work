const path = require('path');

const logpath = path.join(path.dirname(__dirname), 'logs');
const publicpath = path.join(path.dirname(__dirname), 'public');

const config = {
    port: 3000,
    staticDir: publicpath,
    apiRoot: '/v2',
    logger: {
        common: {
            level: 'debug',
            maxFiles: 100,
            maxsize: 1000 * 1000 * 10,
            json: false,
            dirname: logpath,
            //filename: 'http_' + new Date().getTime() + '.log',
            filename: 'http.log',
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