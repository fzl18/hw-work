const utils = require('../lib/common/utils');
const Constants = require('../lib/common/constants')
/**
 * get paths info by address
 * @param {string} address
 * @param {object} options
 * @param {*} chainCore 
 */
function getPaths(options = {}, chainCore) {
    return chainCore.request({
        options,
        command: Constants.BaseChain.toLowerCase+'_path_find',
    }).then((result) => {
        const info = utils.convertKeysToCamelCase(result);
        return info;
    });
}

module.exports = getPaths