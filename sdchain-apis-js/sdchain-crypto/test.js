const ChainAPI = require('./src');
const api = new ChainAPI();
const util = api.base();

const newAddress = api.generateAddress(); // 生成新地址
console.log(newAddress);

const checkAddress = api.generateAddress('shsz7G91rQfhvGvMevoGywHy9J8ty'); // 根据秘钥获取地址
console.log(checkAddress);

const isAddress = api.isValidAddress(); // 判断地址是否合法
console.log(isAddress);

const address = "6GRLu22zvMAPZeUFNPs82oAeyN4jF1Kei2";
const to = "64aAxvqZ1re9vv2xsWJEsmzM5dMWgzcGjR";
const secret = "shsz7G91rQfhvGvMevoGywHy9J8ty";

const txJson = preparePayment(address, to, 100, "SDA", "", "SDA转账", 19);

const signData = api.sign(txJson, secret); // 交易签名
console.log(signData);


function preparePayment(address, to, amount, currency, issuer, memo, sequence) {
    const txJson = {
        "TransactionType": "Payment",
        "Account": address,
        "Destination": to,
        "Amount": util.prepareAmount({
            value: amount,
            currency: currency,
            issuer: issuer
        }),
        "Fee": "100", // 可以放到常量
        "Sequence": sequence, //序列,通过accountinfo获取当前值后+1
        "Memos": [
            {
                "Memo": {
                    "MemoType": util.string2Hex("swallet"), // Type
                    "MemoData": util.string2Hex(memo)       // MemoMessage
                }
            }
        ]
    }
    return txJson;
}