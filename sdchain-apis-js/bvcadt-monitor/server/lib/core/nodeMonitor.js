const models = require('../models')
const request = require('../tools/request');
const tools = require('../tools/tools');

module.exports.findNodeErrorList = async function (_key,page) {
    const limit = 20;
    let skip = (page - 1) * limit;
    if (skip <= 0) {
        skip = 0;
    }
    const node = tools.searchInArray(gNodes,_key)
    const nodeErrors = await models.NodeInfoModel.find({key:_key},{_id:1,time:1,error:1}).sort({time:-1}).skip(skip).limit(limit);
    node.errors = nodeErrors
    return node;
}

module.exports.findNodesLastErrorTime = async function () {
    const nodes = await models.NodeInfoModel.aggregate([{$group:{_id:"$key",time:{$max:"$time"}}}]);

    for(let i in nodes){
        let newNode={
            key:nodes[i]._id,
            lastErrorTime:nodes[i].time
        }
        updateNodesStatus(newNode);
    }
}

module.exports.findNodeError = async function (id) {
    const node = await models.NodeInfoModel.findOne({_id:id});
    return node;
}

module.exports.inspect = async function () {
    const health = {
        status: "UP",
        mongodb: {
          status: "UP",
          url:gConfig.mongodb,
          change:""
        }
      }
    let status = true;
    try {
        await models.NodeInfoModel.findOne({key:1});
    } catch (error) {
        health.mongodb.status = 'DOWN';
        status = false;
    }
    if(!status){
        health.status = 'DOWN';
    }
    return health;
}

module.exports.saveNodeError = async function (nodeInfo) {
    const rt = new  models.NodeInfoModel(
        {
            key: nodeInfo.key,
            address: nodeInfo.address,
            desc: nodeInfo.desc,
            time: nodeInfo.time, 
            error: nodeInfo.error, 
            errorDetail: nodeInfo.errorDetail 
        }
    );
    const rs = await rt.save();
    return rs;
}

module.exports.findNodeStatusList = async function () {
    const nodeList = gNodes;
    return nodeList;
}

module.exports.requestAllInfo = async function() {
    const rst = await request.requestAllInfo();
    return rst;
}

function updateNodesStatus (newNode) {
    for(let i in gNodes){
        if(gNodes[i].key===newNode.key){
            if(newNode.validated!=undefined){
                gNodes[i].validated = newNode.validated;
            }
            if(newNode.lastErrorTime!=undefined){
                gNodes[i].lastErrorTime = newNode.lastErrorTime;
            }
            if(newNode.ledger!=undefined){
                gNodes[i].lastLedger = newNode.ledger;
            }
            if(newNode.time!=undefined){
                gNodes[i].lastTime = newNode.time;
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
    const res =await models.NodeInfoModel.remove({time:{$lte:utc}});
    return res;
}
module.exports.updateNodesStatus = updateNodesStatus