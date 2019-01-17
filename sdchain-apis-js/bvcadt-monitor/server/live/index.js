const tools = require('../lib/tools/tools');
const nodeMonitor = require('../lib/core/nodeMonitor')
const appMonitor = require('../lib/core/appMonitor')
let logger;
const nodeLedgers = {}
let noticeTime = 0
const nodesCount = {}
class Server {
    constructor(config) {
        this._config = config;
        this.interval = config.live.interval;
        logger = config.gLogger;
    }

    async start() {
        logger.info('Start monitor ... ');
        this.inspectLastTime()
        while (true) {
            const nowTime = new Date().getTime()
            const inspect = [
                this.inspectNodes(nowTime),
                this.inspectApps(nowTime)
            ]
            let notices = '';
            const noticesArr = await Promise.all(inspect);
            for(let i in noticesArr){
                if(noticesArr[i]!=''){
                    notices+=noticesArr[i]+';';
                }
            }

            if(this._config.smsCommon.enable&&notices!=''){
               let content = this._config.smsCommon.prefix+'检测错误列表\r\n';
               content+=notices;
               content+='\r\n';
               // 3. 半个小时内只通知一次。
               if(nowTime-noticeTime>this._config.smsCommon.interval){
                   this._config.gNotice.sendsms('cn',this._config.smsCommon.list.join(','),content)
                   noticeTime = nowTime;
               }
            }
            await tools.sleep(this.interval);
        }
    }

    async inspectNodes(nowTime) {
        const nodes = await nodeMonitor.requestAllInfo();
        let content = '';
        const errorNodes = []
        const errorNodesSimple = []
        // gLogger.info(JSON.stringify(nodeLedgers))
        nodes.forEach((node) => {
            
            const errorArr= [];
            let errorDetail = {};
            if(!node.error){
                const nodeInfo = node.result.info;

                //"complete_ledgers" : "1-2658345", 值是一个范围，而不是一个数字或empty，如果是一个数字，表示本地账本停滞。
                if(nodeInfo.complete_ledgers.indexOf('-')<0){
                    errorArr.push('complete_ledgers='+nodeInfo.complete_ledgers);
                }else{
                    const completeLedgers = nodeInfo.complete_ledgers;
                    const nowLedger = completeLedgers.substring(completeLedgers.lastIndexOf('-')+1,completeLedgers.length);
                    if(!nodeLedgers[node.key]){
                        nodeLedgers[node.key]={};
                    }
                    if(nodeLedgers[node.key].lastLedger == nowLedger){
                        // "最大区块"超过3m未增长
                        const timeInterval = nowTime-nodeLedgers[node.key].lastTime;
                        if(timeInterval>180000){
                            errorArr.push('ledger interval='+timeInterval+'ms');
                        }
                    }else{
                        nodeLedgers[node.key].lastLedger=nowLedger
                        nodeLedgers[node.key].lastTime=nowTime
                    }

                }
                // "server_state" : "full" , validating, and proposing 判断server_state值是这三个的时候才表示正常，其他都是异常情况。
                if(gConfig.nodeNormalStates.indexOf(nodeInfo.server_state)<0){
                    errorArr.push('server_state='+nodeInfo.server_state);
                }
                // "peers" >= "0" 正常
                if(nodeInfo.peers<=0){
                    // errorArr.push('peers='+nodeInfo.peers+' && validation_quorum='+nodeInfo.validation_quorum);
                    errorArr.push('peers='+nodeInfo.peers);
                }
                // "status" : "success" 正常
                if(node.result.status != 'success'){
                    errorArr.push('status='+node.result.status);
                }
            }else{
                errorArr.push(node.error)
                errorDetail.error = node.error;
            }
            const newNode = {
                key:node.key
            }
            if(errorArr.length>0){
                newNode.validated=false;
                newNode.lastErrorTime=nowTime;
                const logInfo = {
                    key: node.key,
                    address: node.address,
                    desc: '',
                    time: nowTime, 
                    error: errorArr.join(','), 
                    errorDetail: errorDetail.error?errorDetail:node.result 
                }
                nodeMonitor.saveNodeError(logInfo);
                if(nodesCount[node.key]===undefined){
                    nodesCount[node.key]={}
                }
                const errCount = nodesCount[node.key].errCount
                nodesCount[node.key].errCount = errCount === undefined ? 1 : errCount + 1
                if(nodesCount[node.key].errCount >=3){
                    errorNodes.push('节点标识:'+logInfo.key+','+'节点地址:'+logInfo.address+','+'失败原因:'+logInfo.error);
                }
                errorNodesSimple.push('节点标识:'+logInfo.key+','+'节点地址:'+logInfo.address);
            }else{
                newNode.validated=true;
                delete nodesCount[node.key];
            }
            nodeMonitor.updateNodesStatus(newNode);
            
            
        });

        if(errorNodesSimple.length>0){
            if(errorNodesSimple.length<3){
                // 1. 一次检测异常节点少于3个时，一条短信，通知异常节点及其原因。
                if(errorNodes.length>0){
                    content+=errorNodes.join(';');
                }
            }else{
                // 2. 一次检测有多个节点异常时，一条短信，通知哪些节点有异常，不通知具体原因。
                content+=errorNodesSimple.join(';');
            }
        }
        return content;
    }

    async inspectApps(nowTime) {
        const nodes = await appMonitor.requestAllAppInfo();
        let content = '';
        const errorNodes = []
        const errorNodesSimple = []
        // gLogger.info(JSON.stringify(nodeLedgers))
        nodes.forEach((node) => {
            gLogger.info(JSON.stringify(node))
            const errorArr= [];
            let errorDetail = {};
            if(!node.error){
                const health = node.health || node.data
                if(health){
                    if(health.status == undefined){
                        let errStr = 'UNKNOW health.status';
                        errorArr.push(errStr);
                        errorDetail = node;
                    }else if(health.status == 'DOWN'){
                        for(let _key in health){
                            if(health[_key].status != 'UP'){
                                let errStr = _key+':'+health[_key].status;
                                errorArr.push(errStr);
                                errorDetail = health;
                            }
                        }
                    }
                }else{
                    let errStr = 'UNKNOW health'
                    errorArr.push(errStr);
                    errorDetail = node;
                }
            }else{
                errorArr.push(node.error)
                errorDetail.error = node.error;
            }
            const newNode = {
                key:node.key
            }
            if(errorArr.length>0){
                newNode.validated=false;
                newNode.lastErrorTime=nowTime;
                const logInfo = {
                    key: node.key,
                    address: node.address,
                    desc: '',
                    time: nowTime, 
                    error: errorArr.join(','), 
                    errorDetail: errorDetail
                }
                appMonitor.saveAppError(logInfo);
                errorNodes.push('应用标识:'+logInfo.key+','+'应用地址:'+logInfo.address+','+'失败原因:'+logInfo.error);
                // errorNodesSimple.push('节点标识:'+node.key+'\r\n'+'节点地址:'+node.nodeAddress);
            }else{
                newNode.validated=true;
            }
            
            appMonitor.updateAppsStatus(newNode);
        });

        if(errorNodes.length>0){
            content+=errorNodes.join(',');
        }
        return content;
    }
    async inspectLastTime() {
       const promises = [
            nodeMonitor.findNodesLastErrorTime(),
            appMonitor.findAppsLastErrorTime()
       ]
       await Promise.all(promises)
    }
}

module.exports = Server;