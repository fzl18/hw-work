const request = require('../lib/tools/request');
const _ = require('lodash');
const Bignumber = require('bignumber.js')
const AccountTokenModel = require('../lib/models/account_token');

function keysort(key,sortType){
    return function(a,b){
        return sortType ?(Number(a[key])-Number(b[key])):(Number(a[key])-Number(b[key]))
    }
}
function currencyFilter(currency, trustline) {
    return currency === null || trustline.currency === currency
}

async function syncAccountTokenPers(token){
    const nowTime = new Date().getTime()
    const totail = 10000000;
    const bulkOps = [];
    const tokenArr = token.split(':');
    const postData = {
        account : tokenArr[1],
        // limit:4,
        marker : 0
    }
    let accountLines = []
    while(postData.marker != undefined){
        const res = await request.apiAccountLines(postData);
        const resLines =res.data.result
        postData.marker = resLines.marker
        accountLines=accountLines.concat(resLines.lines.filter(line => {
            return Number(line.balance)<=0&&currencyFilter(tokenArr[0] || null, line)
        }))

        if(accountLines.length>gConfig.tokenPers.count){
            const _lines = accountLines.sort(keysort('balance',false))
            accountLines = _lines.slice(0,gConfig.tokenPers.count)
        }
    }
    accountLines.forEach(line =>{
        const lineM = {
            account: line.account,
            token:token,
            balance: -Number(line.balance),
            percent: -new Bignumber(line.balance)/totail,
            time: nowTime
        }
        bulkOps.push({
            updateOne: {
                filter: {
                    account: line.account,
                    token: token
                },
                update: lineM,
                upsert: true
            }
        });
    })
    return bulkOps;
}

async function syncAllTokenPers(){
  
    let bulkOps = [];
    const promises = [];
    gConfig.tokenPers.tokens.forEach(token => {
        promises.push(syncAccountTokenPers(token));
    });
    const resAll = await Promise.all(promises);
    resAll.forEach(res => {
        bulkOps=bulkOps.concat(res);
        ;
    });
    if(bulkOps.length>0){
        gLog.info("开始统计通证比例");
        await AccountTokenModel.remove({});
        await AccountTokenModel.bulkWrite(bulkOps);
        gLog.info("结束统计通证比例");
    }
    
}

module.exports = {
    syncAllTokenPers
}