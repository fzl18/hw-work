const Constants = {}
Constants.BaseCurrency = 'BVC'
Constants.BaseDrops = 1000000.0
Constants.BaseFee = '10000' // drops
Constants.BaseLedger = 0
Constants.BaseCushion = 1
Constants.BaseAlphabet = {
  chain: 'bpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2rcdeCg65jkm8oFqi1tuvAxyz'
}
Constants.BaseChain = 'BVCADT'
Constants.BaseTimeOut = 60

Constants.Flags = {}
Constants.Flags.AccountRoot = {
  passwordSpent: 0x00010000, // password set fee is spent
  requireDestTag: 0x00020000, // require a DestinationTag for payments
  requireAuth: 0x00040000, // require a authorization to hold IOUs
  disableMaster: 0x00100000, // force regular key
  noFreeze: 0x00200000, // permanently disallowed freezing trustlines
  globalFreeze: 0x00400000, // trustlines globally frozen
  defaultSpread: 0x00800000
}
Constants.Flags.AccountRoot['disallow'+Constants.BaseCurrency]=0x00080000

Constants.Flags.TrustSet = {
  SetAuth: 0x00010000,
  NoSpread: 0x00020000,
  SetNoSpread: 0x00020000,
  ClearNoSpread: 0x00040000,
  SetFreeze: 0x00100000,
  ClearFreeze: 0x00200000
}

Constants.Flags.AccountSet = {
  requireDest: 1,
  requireAuth: 2,
  disableMaster: 4,
  accountTxnID: 5,
  noFreeze: 6,
  globalFreeze: 7,
  defaultSpread: 8,
  depositAuth: 9
}

Constants.Flags.AccountSet['disallow'+Constants.BaseCurrency]=3

Constants.Flags.OfferCreate = {
  Passive: 0x00010000,
  ImmediateOrCancel: 0x00020000,
  FillOrKill: 0x00040000,
  Sell: 0x00080000
},

Constants.Flags.Order = {
  Passive: 0x00010000,
  Sell: 0x00020000
},

Constants.Flags.Trustline = {
  LowReserve: 0x00010000, // entry counts toward reserve
  HighReserve: 0x00020000,
  LowAuth: 0x00040000,
  HighAuth: 0x00080000,
  LowNoSpread: 0x00100000,
  HighNoSpread: 0x00200000,
  LowFreeze: 0x00400000,
  HighFreeze: 0x00800000
},

Constants.FlagsStr = {}
Constants.FlagsStr.TrustSet = {
  SetAuth: { name: 'authorized', set: 'SetAuth' },
  ClearNoSpread: {
    name: 'spread', set: 'ClearNoSpread',
    unset: 'NoSpread'
  },
  SetFreeze: {
    name: 'frozen', set: 'SetFreeze',
    unset: 'ClearFreeze'
  }
}
Constants.FlagsStr.OfferCreateFlags = {
  Passive: {
    name: 'passive',
    value: Constants.Flags.OfferCreate.Passive
  },
  ImmediateOrCancel: {
    name: 'immediateOrCancel',
    value: Constants.Flags.OfferCreate.ImmediateOrCancel
  },
  FillOrKill: {
    name: 'fillOrKill',
    value: Constants.Flags.OfferCreate.FillOrKill
  },
  Sell: {
    name: 'sell',
    value: Constants.Flags.OfferCreate.Sell
  }
}
module.exports = Constants
