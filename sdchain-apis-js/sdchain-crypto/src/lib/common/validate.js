const Errors = require('./errors');
const constants = require('./constants');
const generateAddress = require('../../offline/generateAddress');
const keypairs = require('../../lib/chain-keypairs')

ValidationError = Errors.ValidationError;

function address(address) {
    if (!/^6[1-9A-HJ-NP-Za-km-z]{25,34}$/.test(address)) {
        throw new ValidationError('Illegal address: ' + address);
    }
    return true;
}

function currency(currency) {
    if (!/^([a-zA-Z0-9]{2,5}|[A-Fa-f0-9]{40})$/.test(currency)) {
        throw new ValidationError('Illegal currency: ' + currency);
    }
    return true;
}

function issuer(amount) {
    return amount && currency(amount.currency)
        && ((amount.currency === constants.BaseCurrency && !amount.counterparty && !amount.issuer)
            || (amount.currency !== constants.BaseCurrency && address(
                amount.counterparty || amount.issuer)));
}

function value(value) {
    return typeof value === 'string' && value.length > 0 && isFinite(value);
}

function amount(amount, parameter) {
    if (!(issuer(amount) && value(amount.value))) {
        throw new ValidationError('Illegal ' + (parameter ? parameter : "amount") + '.Must be a valid Amount object');
    }
}

function addressAndSecret(address, secret) {
    try {
        if (generateAddress(secret).wallet.address !== address) {
            throw new ValidationError('Illegal secret :the sercet can not match the address');
        }
    } catch (err) {
        throw new ValidationError('Illegal secret :the sercet can not match the address');
    }
   
}

function secret(secret) {
    try {
        keypairs.deriveKeypair(secret)
    } catch (err) {
        throw new ValidationError('Illegal secret: '+secret);
    }
}

function apiConstant(options) {
    if(options.baseCurrency){
        if(options.baseCurrency.toUpperCase()!=options.baseCurrency){
            throw new ValidationError('Illegal baseCurrency: '+options.baseCurrency+'.Must be capital letters');
        }
    }else{
        throw new ValidationError('Parameter missing: baseCurrency');
    }   
    if(options.baseFee){
        if(!Number.isInteger(options.baseFee)){
            throw new ValidationError('Illegal baseFee: '+options.baseFee+'.Must be a number');
        }
    }else{
        throw new ValidationError('Parameter missing: baseFee');
    }
    if(options.baseAlphabet){
        
    }else{
        throw new ValidationError('Parameter missing: baseAlphabet');
    }

}



module.exports = {
    address,
    currency,
    amount,
    addressAndSecret,
    secret,
    apiConstant
};
