function parseFlags(responseFlags, flags) {
	var parsedFlags = {};

	for ( var flagName in flags) {
		var flag = flags[flagName];
		parsedFlags[flag.name] = Boolean(responseFlags & flag.value);
	}

	return parsedFlags;
}

module.exports = parseFlags
