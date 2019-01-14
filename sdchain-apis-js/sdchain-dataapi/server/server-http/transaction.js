const TransactionModel = require('../lib/models/transaction');

async function countTransactions(){
    const res = await TransactionModel.count({});
    return res
}

module.exports = {
    countTransactions
}