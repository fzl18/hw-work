const utils = require('../lib/common/utils');

/**
 * get chain core server info.
 * @param {*} options 
 * @param {*} chainCore 
 */
function getServerInfo(options = {}, chainCore) {
    return chainCore.request({ command: 'server_info' })
        .then((result) => {
            if(result.info&&result.info.validated_ledger&&result.info.validated_ledger){
                for(let i in result.info.validated_ledger){
                    if(i.indexOf('_')>0&&i.indexOf('_')!=i.lastIndexOf('_')){
                        const _i=i.substring(0,i.lastIndexOf('_'))
                        result.info.validated_ledger[_i]=result.info.validated_ledger[i]
                        delete result.info.validated_ledger[i]
                    }         
                }
            }
            const convert = options.convert == false ? false : true;
            const info = convert ? utils.convertKeysToCamelCase(result.info) : result.info;
            return info;
        });
}

module.exports = getServerInfo;
