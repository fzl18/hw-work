const utils = require('../lib/common/utils');
const constants = require('../lib/common/constants');


function parseAmount(chaindAmount, useIssuer) {
	let amount = {};

	if (typeof chaindAmount === 'string') {
		amount.currency = constants.BaseCurrency;
		amount.value = utils.dropsToBase(chaindAmount);
		if (useIssuer) {
			amount.issuer = '';
		} else {
			amount.counterparty = '';
		}
	} else {
		amount.currency = chaindAmount.currency;
		amount.value = chaindAmount.value;
		if (useIssuer) {
			amount.issuer = chaindAmount.issuer;
		} else {
			amount.counterparty = chaindAmount.issuer;
		}
	}

	return amount;
}

module.exports = parseAmount;