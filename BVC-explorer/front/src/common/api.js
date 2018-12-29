const api = {
    transactionsTotal:'api/data/transactionsTotal', //交易总量
    txCharts:'api/data/txCharts', //交易统计
    ledgers:'api/data/ledgers', //区块高度列表 （详情）param: ledger
    
    transactions:'api/data/transactions', //交易记录 （详细）  param :hash
    accounts:'api/data/accounts', // 账户交易历史 :account/transactions
    balances:'api/cable/accounts/balances', //账户余额 :account
    tokenDetail:'api/cache/tokenDetail', //
    
}

export default api