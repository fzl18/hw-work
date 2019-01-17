const ChainAPI = require('./src');
const api = new ChainAPI();
const txJSON = {
    "Account": "bNCwPQH1wQ45wYfGUK889vRQQswLrjm1wF",
    "Destination": "bEZRzPZQiKaG7RFJsCCvx22Fkg44Z4gxcc",
    "TransactionType": "Payment",
    "Amount": "1000000",
    "Fee": "100",
    "Sequence": 50,
    "Memos": [
        {
            "Memo": {
                "MemoType": "54797065", // Type
                "MemoData": "4D656D6F4D657373616765" // MemoMessage
            }
        }
    ]
};
const secret = 'ssmwFthxgJgtfUrKbLHK8iy4BVxEh';
let signData = api.sign(JSON.stringify(txJSON), secret);
console.log(signData);