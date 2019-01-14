const HttpServer = require("./server-http");
const LiveServer = require("./server-live");
const tools = require('./lib/tools/tools');
tools.freshNodeServer();
// Http服务
module.exports.HttpServer = HttpServer;
// 实时同步区块
module.exports.LiveServer = LiveServer;