const config = {
    mongodb: 'mongodb://monitorrw:monitorrw.12345@10.0.12.51:27017/monitor_test',
    http: {
        port: 3100,
        staticDir: './public',
        apiRoot: '/api'
    },
    live: {
        interval: 60 * 1000,
    },
    nodeNormalStates:[
        'full',
        'validating',
        'proposing'
    ],
    monitor: {
        removeLimit:0,//day
        nodeList: [
            /* {
                key: 'CORE_p_bvc_core001',
                address: 'http://172.16.0.11:53234',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'CORE_p_bvc_core002',
                address: 'http://172.16.0.12:53234',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'CORE_p_bvc_core003',
                address: 'http://172.16.0.13:53234',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'CORE_p_bvc_core004',
                address: 'http://172.16.0.14:53234',
                validated: false,
                desc: '',
                lastErrorTime: ''
            } */
        ],
        appList:[
            {
                key: 'APP_CABLE_HK',
                address: 'https://cable-hk.sdchain.io/v1/health?token=12345',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'APP_DADAAPI',
                address: 'https://data-api.sdchain.io/v2/health?token=dataapitoken',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'APP_CABLE',
                address: 'https://cable.sdchain.io/v1/health?token=12345',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
            {
                key: 'APP_CABLE',
                address: 'https://cable.sdchain.io/v1/health?token=12345',
                validated: false,
                desc: '',
                lastErrorTime: ''
            },
        ]
    },
    sms: {
        cn: {
            url: 'http://sms.cloud.hbsmservice.com:8080/sms_send2.do',
            corp_id: 'ly2018',
            corp_pwd: 'sd1752',
            corp_service: '852645068707962',
            ext: '6666'
        },
        en: {
            url: 'http://sms.cloud.hbsmservice.com:8080/sms_send2.do',
            corp_id: 'ly2018',
            corp_pwd: 'sd1752',
            corp_service: '852645068707962',
            ext: '6666'
        }
    },
    // sms: {
    //     cn: {
    //         url: 'http://sms.cloud.hbsmservice.com:8080/sms_send2.do',
    //         corp_id: 'ly2635',
    //         corp_pwd: 'vd45f4',
    //         corp_service: '106914391233',
    //         ext: '6666'
    //     },
    //     en: {
    //         url: 'http://sms.cloud.hbsmservice.com:8080/sms_send2.do',
    //         corp_id: 'ly2018',
    //         corp_pwd: 'sd1752',
    //         corp_service: '852645068707962',
    //         ext: '6666'
    //     }
    // },
    smsCommon:{
        list:[
            '15051769183',
            // '15961753153',
            // '13338769376'
        ],
        prefix:'BVC正式环境',
        enable:true,
        interval: 30 * 60 * 1000
    },
    token:'12345',
    
    logger: {
        common: {
            level: 'debug',
            maxFiles: 100,
            maxsize: 1000 * 1000 * 10,
            json: false,
            dirname: process.cwd() + '/logs',
            filename: 'app.log',
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