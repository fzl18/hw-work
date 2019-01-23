const path = require('path');

const logpath = path.join(path.dirname(__dirname), 'logs');
const chainFile = path.join(path.dirname(__dirname), 'config', 'chain.json');

const config = {
    currency: 'BVC',
    chain: 'BVCADT',
    mongodb: 'mongodb://dataapirw:dataapirw.12345@10.0.12.51:27017/bvcdataapi',
    chainFile: chainFile,
    chainServer: '',
    chainDrops:1000000.0,
    sync:{
        order:true,
        account:true
    },
    exceptTypes: [
        'EnableAmendment',
        'SetFee',
        'TicketCreate',
        'TicketCancel',
        'CheckCancel',
        'CheckCash',
        'CheckCreate',
        'DepositPreauth'
    ],
    orderClinchTypes: [
        'OfferCreate'
    ],
    orderTypes: [
        'OfferCreate',
        'OfferCancel'
    ],
    orderPairs: [
        "BVC/CADT:b3dTws3ShReaHefvkXvT4sn5L7z26SRMky",
        "TESTA:b4BH7jgB8c2jAAPHVg6UWNXy5NmjBXZ2xG/CADT:b3dTws3ShReaHefvkXvT4sn5L7z26SRMky",
        "BVC/TESTB:bngSDR4Mr7eEKt7UrNJgw21ArbHEh9crUX",
        "TESTA:b4BH7jgB8c2jAAPHVg6UWNXy5NmjBXZ2xG/TESTB:bngSDR4Mr7eEKt7UrNJgw21ArbHEh9crUX"
    ],
    tokenPers:{
        interval:30*60000,
        count:1000,
        tokens:[
            "CADT:b3dTws3ShReaHefvkXvT4sn5L7z26SRMky"
        ]
    },
    mongodbOpts: {
        auto_reconnect: true,
        poolSize: 10
    },
    mailEnable: false,
    mail: {
        host: 'smtp.126.com',
        port: '465',
        user: 'sddatapi@126.com',
        pass: 'sd10242048',
        name: '开发'
    },
    mailList: [
        'sand_ant@163.com',
        '646021075@qq.com',
        '281419087@qq.com'
    ],
    ledgerInterval: 5000,
    ledgerFailInterval: 60000,
    ledgerEqualDuration: 120,
    ledgerSecsDiff: 60,
    nodes: [
        {
            key: '',
            address: 'http://10.0.11.31:53234',
            desc: '内网1131'
        }
    ],
    mailPrefix: '开发环境',
    token: 'dataapitoken',
    nodeInterval: 7200000,
    nodeLedgerDiff: 10,
    logger: {
        common: {
            level: 'debug',
            maxFiles: 100,
            maxsize: 1000 * 1000 * 10,
            json: false,
            dirname: logpath,
            filename: 'common_' + new Date().getTime() + '.log',
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