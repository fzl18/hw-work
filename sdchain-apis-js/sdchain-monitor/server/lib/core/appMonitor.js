const models = require('../models')
const request = require('../tools/request');
const tools = require('../tools/tools');

module.exports.findAppErrorList = async function (_key) {
    const app = tools.searchInArray(gApps,_key)
    const appErrors = await models.AppInfoModel.find({key:_key},{_id:1,time:1,error:1}).sort({time:-1});
    app.errors = appErrors
    return app;
}

module.exports.findAppError = async function (id) {
    const app = await models.AppInfoModel.findOne({_id:id});
    return app;
}
module.exports.findAppsLastErrorTime = async function () {
    const apps = await models.AppInfoModel.aggregate([{$group:{_id:"$key",time:{$max:"$time"}}}]);
    for(let m in apps){
        let newNode={
            key:apps[m]._id,
            lastErrorTime:apps[m].time
        }
        updateAppsStatus(newNode);
    }
}
module.exports.saveAppError = async function (appInfo) {
    const rt = new  models.AppInfoModel(
        {
            key: appInfo.key,
            address: appInfo.address,
            desc: appInfo.desc,
            time: appInfo.time, 
            error: appInfo.error, 
            errorDetail: appInfo.errorDetail 
        }
    );
    const rs = await rt.save();
    return rs;
}

module.exports.findAppStatusList = async function () {
    const list = gApps;
    return list;
}

module.exports.requestAllAppInfo = async function() {
    const rst = await request.requestAllAppInfo();
    return rst;
}

function updateAppsStatus (newObj) {
    for(let i in gApps){
        if(gApps[i].key===newObj.key){
            if(newObj.validated!=undefined){
                gApps[i].validated = newObj.validated;
            }
            if(newObj.lastErrorTime!=undefined){
                gApps[i].lastErrorTime = newObj.lastErrorTime;
            }
            if(newObj.time!=undefined){
                gApps[i].lastTime = newObj.time;
            }
            break;
        }
    }
};

module.exports.removeEarlyLog = async function (date) {
    const n = new Date().getTime()
    const d = new Date(date)
    const localTime = d.getTime()
    if((n-d)<=(gConfig.monitor.removeLimit*24*3600*1000)){
        throw Error("Can't remove the last "+gConfig.monitor.removeLimit+" day's log")
    }
    const localOffset = d.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const res =await models.AppInfoModel.remove({time:{$lte:utc}});
    return res;
}
module.exports.updateAppsStatus = updateAppsStatus
