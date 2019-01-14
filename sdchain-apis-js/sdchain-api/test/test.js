const ChainAPI = require('../src/index')

const api = new ChainAPI({ url: 'http://192.168.0.21:53234', trace: true })
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"

const issuer0 = {
  address: '6KySVnf6vxDtNeQAZUgpWWBdoMBcnyQmoq',
  secret: 'shbafzH12HrCyfnjcaKcWF4knGFW9',
  //   hash: 'B357C69531BD4DCB5F4247B62D2E04C054B8818A93BE817B6A00B8CFC5DD88D6'
  //   hash:'678EFBD0E0EAA1B097D5340D4312850525934BDE687CAC7BBCEC9DAEDCDC690F' //trustset 
  //   hash:'DB577676755B519ED5B916D327EE783B3F7DDF7366C365358103A20FFA291C28' //accountset 
  hash: 'CFCE47C8DB71398B3841C28F891DC94149A6CC9110F3BC5C1FBF375900FA1C74' // offercreate
}
const issuer1 = {
  address: '6pmFKmAcYskZdmtmcTwwFAuVcsRYsQgBXA',
  secret: 'sa3reopGdU4UkCqVEuR62vwVBad3x'
}

const account0 = {
  address: '6GiohV7XVhabbtV1DfKjWEyikeyimiDSNx',
  secret: 'ssaWWHNnYyU4R8WdSzD8XFCNxKyYc'
}

const account1 = {
  address: '6PKbrbSLKRmgb5nqqGP3hxWBj6o2ufZrTt',
  secret: 'spoWzgEy9oTnkK6ZgiAY1stWp2vsC'
}
const address = account0.address
// const hash1 = 'B357C69531BD4DCB5F4247B62D2E04C054B8818A93BE817B6A00B8CFC5DD88D6'
// const hash2 = '678EFBD0E0EAA1B097D5340D4312850525934BDE687CAC7BBCEC9DAEDCDC690F' // trustset 
// const hash3 = 'DB577676755B519ED5B916D327EE783B3F7DDF7366C365358103A20FFA291C28' // accountset 
const hash4 = '91F049F132E085BF16A42AF6C6EA8837133A739712ADC1950ED7ED41AAB9BE79' // offercreate
const base = {
    currency: 'SDA'
  },
  counter = {
    currency: 'CNY',
    issuer: '6UPd52jHtu1d88nc3S3WeroACFQpKfybhU'
}

const orderAddress = '6M5F6qeCQBxSQQeoKdCPURq4sNFgZeFD5Y'

var accountSetJson = {
  defaultSpread: true,
  memos: [{
    memoType: 's',
    memoData: 's'
  }]
}
const amount = {
  value: '1',
  currency: 'CNY',
  issuer: '6UPd52jHtu1d88nc3S3WeroACFQpKfybhU'
}
const limitAmount = {
  value: '10000',
  currency: 'CNY',
  issuer: '6UPd52jHtu1d88nc3S3WeroACFQpKfybhU'
}
const paymentJson = {
  destination: account1.address,
  amount: amount,
  fee: 0.0001,
}
const memos = [ {
  memoType : 'name',
		memoDate : '测试'
}]
// const memo =
// memos.add(memo)
paymentJson.memos = memos
const trustlineJson = {
  limitAmount: limitAmount,
  spread: true,
  fee: 0.001
}
const quantity = {
  value: '0.01',
  currency: 'SDA',
  issuer: ''
}
const totalPrice = {
  value: '1000',
  currency: 'CNY',
  issuer: '6UPd52jHtu1d88nc3S3WeroACFQpKfybhU'
}

const orderJson = {
  direction:'sell',
  quantity: quantity,
  totalPrice: totalPrice,
  fee: 0.001
}

const orderCancelJson = {
  offerSequence:7023,
  fee:0.0001
}

const settingsJson = {
  defaultSpread:false,
  domain:'中国',
  fee:0.0001
}



api.connect()
  .then(() => {
    console.log('connected')
  })
  // getServerInfo
  .then(() => {
    return api.getServerInfo()
  }).then((result) => {
  console.log('getServerInfo: \n', JSON.stringify(result))
})
  // getFee
  .then(() => {
    return api.getFee()
  }).then((result) => {
  console.log('getFee: \n', JSON.stringify(result))
})
  // getLedgers
  .then(() => {
    const options = {
      ledgerIndex: 617600,
      // expand:true,
      transactions: true,
    // accounts: true
    }
    return api.getLedger(options)
  }).then((result) => {
  console.log('getLedger: \n', JSON.stringify(result))
})
  // generateAddress
  .then(() => {
    return api.generateAddress()
  })
  .then((result) => {
    console.log('generateAddress: \n', JSON.stringify(result))
  })
  // getAccountInfo
  .then(() => {
    return api.getAccountInfo(address)
  })
  .then((result) => {
    console.log('getAccountInfo: \n', JSON.stringify(result))
  })
  // getAccountLines
  .then(() => {
    const options = {
      limit: 2,
    // ledger: 300000
    // marker:"1E5B78D2CE448B9738D0C8639A3C289B1774028402E5FE219BD0F6AAC4479902"
    // currency: 'CNY'
    }
    return api.getAccountLines(address, options)
  })
  .then((result) => {
    console.log('getAccountLines: \n', JSON.stringify(result))
  })
  // getBalances
  .then(() => {
    const options = {
      limit: 2,
      // ledger: 300000
      marker: '1E5B78D2CE448B9738D0C8639A3C289B1774028402E5FE219BD0F6AAC4479902'
    // currency: 'CNY'
    }
    return api.getBalances(address, options)
  })
  .then((result) => {
    console.log('getBalances: \n', JSON.stringify(result))
  })
  // getSettings
  .then(() => {
    return api.getSettings(address)
  })
  .then((result) => {
    console.log('getSettings: \n', JSON.stringify(result))
  })
  // getTransaction
  .then(() => {
    return api.getTransaction(hash4)
  })
  .then((result) => {
    console.log('getTransaction: \n', JSON.stringify(result))
  })
  // getTransactions
  .then(() => {
    const options = {
      limit: 2
    }
    return api.getTransactions(address, options)
  })
  .then((result) => {
    console.log('getTransactions: \n', JSON.stringify(result))
  })
  // getOrders
  .then(() => {
    const options = {
      limit: 1,
    // marker:'81D7B3CDFDDEA09ABF74CD0F44D73DCB4A3148EB81D8300DA9E43AE604285CF0'
    }
    return api.getOrders(orderAddress, options)
  })
  .then((result) => {
    console.log('getOrders: \n', JSON.stringify(result))
  })

  // getOrderBook
  .then(() => {
    const options = {
      limit: 2,
    // marker:'81D7B3CDFDDEA09ABF74CD0F44D73DCB4A3148EB81D8300DA9E43AE604285CF0'
    }
    return api.getOrderBook(base, counter, options)
  })
  .then((result) => {
    console.log('getOrderBook: \n', JSON.stringify(result))
  })
  // preparePayment
  .then(() => {
    return api.preparePayment(account0.address, paymentJson)
  })
  // preparePayment
  // .then((result) => {
  //   console.log('preparePayment: \n', JSON.stringify(result))
  //   return api.prepareTrustline(account1.address, trustlineJson)
  // })
  // // prepareTrustline
  // // .then((result) => {
  // //   console.log('prepareTrustline: \n', JSON.stringify(result))
  // //   // return api.prepareTrustline(account0.address, trustlineJson)
  // // })
  // .then((result) => {
  //   console.log('prepareTrustline: \n', JSON.stringify(result))
  //   return api.prepareOrder(account0.address, orderJson)
  // })
  // .then((result) => {
  //   console.log('prepareOrder: \n', JSON.stringify(result))
  //   return api.prepareOrderCancellation(account0.address, orderCancelJson)
  // })
  // .then((result) => {
  //   console.log('prepareOrderCancellation: \n', JSON.stringify(result))
  //   return api.prepareSetting(account0.address,settingsJson)
  // })
  .then((result) => {
    console.log('prepareSetting: \n', JSON.stringify(result))
    return api.sign(result.txJson,account0.secret )
  })
  
  .then((result) => {
    console.log('sign: \n',  JSON.stringify(result))
    return api.submit(result.signedTransaction)
  })
  .then((result) => {
    console.log('submit: \n',  JSON.stringify(result))
  })
  /* .then(() => {
      api.chainCore.on(api.chainCore.getEventPrefix() + 'ledgerClosed', (msg) => {
          console.log('lis:', msg)
      })
      api.chainCore.request({
          command: 'subscribe',
          streams: ['ledger']
      })
  }) */
  //
  .then(() => {
    return api.disconnect()
  }).then(() => {
  console.log('disconnected')
}).catch((err) => {
  console.log('err: \n', err)
  api.disconnect()
})
