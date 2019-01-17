const rp = require('request-promise');

class Request {
    constructor() {
    }

    /**
     * 同步所有节点server_info
     * @returns {Promise<void>}
     */
    static async requestAllInfo() {
        const promises = gNodes.map((node) => {
            return this.serverInfo(node);
        });

        const rst = await Promise.all(promises);
        return rst;
    }

    /**
     * 同步节点server_info
     * @param node
     * @returns {Promise<void>}
     */
    static async serverInfo(node) {
        const data = {
            method: 'server_info',
            params: [
                {}
            ]
        };

        const options = {
            url: node.address,
            method: 'POST',
            json: true,
            body: data,
            timeout: 10000
        };
        let rst = {};

        try {
            rst = await rp(options);
        } catch (e) {
            rst.error = e.message;
            gLogger.error(e);
        }
        rst.address = node.address;
        rst.key = node.key;
        return rst;
    }

    
    /**
     * 请求所有应用health
     * @returns {Promise<void>}
     */
    static async requestAllAppInfo() {
        const promises = gApps.map((app) => {
            return this.appInfo(app);
        });

        const rst = await Promise.all(promises);
        return rst;
    }
    /**
     * app
     * @param app
     * @returns {Promise<void>}
     */
    static async appInfo(app) {

        const options = {
            url: app.address,
            method: 'GET',
            json: true,
            timeout: 10000
        };
        let rst = {};

        try {
            rst = await rp(options);
        } catch (e) {
            rst.error = e.message;
            gLogger.error(e);
        }
        rst.address = app.address;
        rst.key = app.key;
        return rst;
    }
}

module.exports = Request;