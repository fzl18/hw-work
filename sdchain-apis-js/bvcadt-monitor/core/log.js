const path = require('path');
const fs = require('fs');
const winston = require('winston');

module.exports = function (logConfig) {
    mkdir(path.join(logConfig.common.dirname, logConfig.common.filename));
    return new (winston.Logger)({
        transports: [
            new (winston.transports.File)(logConfig.common),
            new winston.transports.Console(),
        ]
    });
}

function mkdir(dir) {
    let p = path.dirname(path.normalize(dir));
    let isAbs = path.isAbsolute(p);
    let current_path = '';
    p = p.split(path.sep);
    if (isAbs) {
        current_path = p[0];
        if ((current_path.length <= 0) && (path.sep == '/')) {
            current_path = "/";
        }
        p.shift();
    }

    for (let i = 0; i < p.length; ++i) {
        current_path = path.join(current_path, p[i]);
        if (!fs.existsSync(current_path)) {
            fs.mkdirSync(current_path);
        }
    }
};

