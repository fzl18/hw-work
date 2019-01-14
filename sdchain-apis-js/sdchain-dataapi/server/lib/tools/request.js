const rp = require('request-promise');

class Request {
    constructor() {
    }

    /**
     * 获取最新验证的账本高度
     * @returns {Promise<*>}
     */
    static async getLedgerValidated() {
        const data = {
            method: 'ledger',
            params: [
                {
                    ledger_index: 'validated',
                    accounts: false,
                    full: false,
                    transactions: false,
                    expand: false,
                    owner_funds: false
                }
            ]
        };

        return await this.doRequest(data);
    }

    /**
     * 获取最新关闭的账本高度
     * @returns {Promise<*>}
     */
    static async getLedgerClosed() {
        const data = {
            method: 'ledger_closed',
            params: [
                {}
            ]
        };

        return await this.doRequest(data);
    }

    static async getLedgerInfo(index) {
        const data = {
            method: "ledger",
            params: [
                {
                    ledger_index: index,
                    accounts: false,
                    full: false,
                    transactions: true,
                    expand: true,
                    owner_funds: false
                }
            ]
        };
        return await this.doRequest(data);
    }

    static async getLedgerRequest(index) {
        const data = {
            method: "ledger_request",
            params: [
                {
                    ledger_index: index,
                    accounts: true,
                    full: false,
                    transactions: true,
                    expand: true,
                    owner_funds: false
                }
            ]
        };
        return await this.doRequest(data);
    }

    /**
     * /v2/ledgers
     * @returns {Promise<void>}
     */
    static async apiLedgerInfo() {
        const data = {
            method: "ledger",
            params: [
                {
                    ledger_index: "validated",
                    accounts: false,
                    full: false,
                    transactions: false,
                    expand: false,
                    owner_funds: false
                }
            ]
        };
        return await this.doRequest(data);
    }

    /**
     * /v2/ledgers/ledger
     * 获取指定区块数据
     * @param ledger
     * @returns {Promise<void>}
     */
    static async apiLedgerDetail(ledger) {
        const data = {
            method: "ledger",
            params: [
                {
                    ledger_index: ledger,
                    accounts: false,
                    full: false,
                    transactions: false,
                    expand: false,
                    owner_funds: false
                }
            ]
        };
        return await this.doRequest(data);
    }

    /**
     * /v2/transactions/:hash
     * 获取交易详情
     * @param hash
     * @returns {Promise<void>}
     */
    static async apiTransactionInfo(hash) {
        const data = {
            method: "tx",
            params: [
                {
                    transaction: hash,
                    binary: false
                }
            ]
        };
        return await this.doRequest(data);
    }

    /**
     * 获取账户信息
     * @param account
     * @returns {Promise<void>}
     */
    static async apiAccountInfo(account) {
        const data = {
            method: "account_info",
            params: [
                {
                    account: account,
                    strict: true,
                    ledger_index: 'current',
                    queue: true
                }
            ]
        };
        return await this.doRequest(data);
    }

    /**
     * 获取账户二级资产信息
     * @param account
     * @returns {Promise<void>}
     */
    static async apiAccountLines(options) {
        const data = {
            method: 'account_lines',
            params: [
                {   
                    account: options.account,
                    peer: options.counterparty,
                    limit: options.limit ? (Number(options.limit) || 100) : 400,
                    marker: options.marker == 0 ? undefined:options.marker
                }
            ]
        };

        return await this.doRequest(data);
    }

    /**
     * 发送底层请求
     * @param data
     * @returns {Promise<void>}
     */
    static async doRequest(data) {
        const options = {
            url: gConfig.chainServer,
            method: 'POST',
            json: true,
            body: data,
            timeout: 10000
        };
        let rst = {
            error: 0,
            message: 'OK',
            data: {}
        };

        try {
            rst.data = await rp(options);
        } catch (e) {
            rst.error = 1;
            rst.message = e.message;
            gLog.error('请求底层异常：', e.message, '请求参数：', JSON.stringify(options));
        }

        return rst;
    }

    /**
     * 同步所有区块数据
     * @returns {Promise<void>}
     */
    static async requestAllNodes() {
        const promises = gConfig.nodes.map((node) => {
            return this.nodeInfo(node);
        });

        const rst = await Promise.all(promises);
        return rst;
    }

    /**
     * 同步节点信息
     * @param node
     * @returns {Promise<void>}
     */
    static async nodeInfo(node) {
        const data = {
            method: 'ledger',
            params: [
                {
                    ledger_index: 'validated',
                    accounts: false,
                    full: false,
                    transactions: false,
                    expand: false,
                    owner_funds: false
                }
            ]
        };

        const options = {
            url: node,
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
            gLog.error('同步节点数据异常：', e.message, '请求参数：', JSON.stringify(options));
        }
        rst.nodeAddress = node;

        return rst;
    }

    /**
     * 同步所有节点server_info
     * @returns {Promise<void>}
     */
    static async requestAllInfo() {
        const promises = gConfig.nodes.map((node) => {
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
            url: node,
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
            gLog.error(e);
        }
        rst.nodeAddress = node;

        return rst;
    }

}

module.exports = Request;