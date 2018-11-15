'use strict';

// Copyright 2016 Joyent, Inc.

var x509 = require('./x509.js');

module.exports = {
	read: read,
	verify: x509.verify,
	sign: x509.sign,
	write: write
};

var assert = require('../../../assert-plus/assert.js');
var asn1 = require('../../../asn1/lib/index.js');
var Buffer = require('../../../safer-buffer/safer.js').Buffer;
var algs = require('../algs.js');
var utils = require('../utils.js');
var Key = require('../key.js');
var PrivateKey = require('../private-key.js');
var pem = require('./pem.js');
var Identity = require('../identity.js');
var Signature = require('../signature.js');
var Certificate = require('../certificate.js');

function read(buf, options) {
	if (typeof buf !== 'string') {
		assert.buffer(buf, 'buf');
		buf = buf.toString('ascii');
	}

	var lines = buf.trim().split(/[\r\n]+/g);

	var m = lines[0].match( /*JSSTYLED*/
	/[-]+[ ]*BEGIN CERTIFICATE[ ]*[-]+/);
	assert.ok(m, 'invalid PEM header');

	var m2 = lines[lines.length - 1].match( /*JSSTYLED*/
	/[-]+[ ]*END CERTIFICATE[ ]*[-]+/);
	assert.ok(m2, 'invalid PEM footer');

	var headers = {};
	while (true) {
		lines = lines.slice(1);
		m = lines[0].match( /*JSSTYLED*/
		/^([A-Za-z0-9-]+): (.+)$/);
		if (!m) break;
		headers[m[1].toLowerCase()] = m[2];
	}

	/* Chop off the first and last lines */
	lines = lines.slice(0, -1).join('');
	buf = Buffer.from(lines, 'base64');

	return x509.read(buf, options);
}

function write(cert, options) {
	var dbuf = x509.write(cert, options);

	var header = 'CERTIFICATE';
	var tmp = dbuf.toString('base64');
	var len = tmp.length + tmp.length / 64 + 18 + 16 + header.length * 2 + 10;
	var buf = Buffer.alloc(len);
	var o = 0;
	o += buf.write('-----BEGIN ' + header + '-----\n', o);
	for (var i = 0; i < tmp.length;) {
		var limit = i + 64;
		if (limit > tmp.length) limit = tmp.length;
		o += buf.write(tmp.slice(i, limit), o);
		buf[o++] = 10;
		i = limit;
	}
	o += buf.write('-----END ' + header + '-----\n', o);

	return buf.slice(0, o);
}