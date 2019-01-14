const Constants = require('../common/constants')

const ex =  {
  account        : 'a',
  dirNode        : 'd',
  generatorMap   : 'g',
  offer          : 'o',  // Entry for an offer.
  ownerDir       : 'O',  // Directory of things owned by an account.
  bookDir        : 'B',  // Directory of order books.
  contract       : 'c',
  skipList       : 's',
  amendment      : 'f',
  feeSettings    : 'e',
  signerList     : 'S',
  escrow         : 'u',
  paychan        : 'x'
};
ex[Constants.BaseChain.toLowerCase+'State'] = 'r'
module.exports = ex
