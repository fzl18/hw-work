const ChainAPI = require('../src/index');

const api = new ChainAPI({ url: 'http://192.168.0.21:53234/', trace: true });
//const api = new ChainAPI({ url: 'ws://192.168.0.21:6066', trace: true });

// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";



const address1 = 'bPKbrbSLKRmgb5nqqGP3hxWBj6o2ufZrTt';
const secret1 = 'spoWzgEy9oTnkK6ZgiAY1stWp2vsC';
const address2 = 'bnMdYyvunzW7GvEkUUtujp7RafE6PvVBH4';
const secret2 = 'spoHKVBiFyWDKsyDfKjWvzU3NzM6M';

async function index() {
    await api.connect();
    //await payment();
    const txs = await api.getTransactions(address2, { limit: 1 });
    txs.transactions.forEach(tx => {
        console.log(JSON.stringify(tx));
    });

    await api.disconnect();
}

async function payment() {
    const payJson = {
        destination: address2,
        amount: {
            value: '10',
            currency: api.base().baseCurrency,
            issuer: ''
        },
        fee: 0.0001,
        memos: [{
            memoType: 'thanosx',
            memoData: '1024'
        }]
    }
    const preRt = await api.preparePayment(address1, payJson);
    const signRt = api.sign(preRt.txJson, secret1);
    const rt = await api.submit(signRt.signedTransaction);
    console.log(rt);
}

index()

