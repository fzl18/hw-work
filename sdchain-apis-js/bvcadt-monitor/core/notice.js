const qs = require('querystring');
const URL = require('url');
const http = require('http');
const request = require('request-promise');

class Notice {
    constructor(config) {
        this._config = config;
    }

    async sendsms(districtCode, mobile, content) {
        let config = this._config.cn;
        if (districtCode && districtCode == 'en') {
            config = this._config.en;
        }

        const url = config.url;
        const data = {};
        data['corp_id'] = config.corp_id;
        data['corp_pwd'] = config.corp_pwd;
        data['corp_service'] = config.corp_service;
        data['corp_msg_id'] = '' + new Date().getTime();
        data['ext'] = config.ext;
        data['mobile'] = mobile;
        data['msg_content'] = content;

        const rt = request({
            uri: url,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            },
            method: 'POST',
            qs: data,
            json: false
        });

        return rt;
    }
}
module.exports = Notice;

/* 
function doPostRequest(url, data) {
    return new Promise((resolve, reject) => {
        const postData = qs.stringify(data);

        const urlInfo = new URL(url);
        const options = {
            hostname: urlInfo.hostname,
            port: urlInfo.port,
            path: urlInfo.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            const chunkArr = [];
            res.setEncoding('utf-8');
            res.on('data', (chunk) => {
                chunkArr.push(chunk);
            });
            res.on('end', () => {
                resolve(chunkArr.join(''));
            });
        });
        req.on('error', (e) => {
            reject(e);
        });
        req.setTimeout(10000);
        req.write(postData);

        req.end();
    }); 
}*/



