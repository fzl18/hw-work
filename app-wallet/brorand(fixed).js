var r;

module.exports = function rand(len) {
  if (!r)
    r = new Rand(null);

  return r.generate(len);
};

function Rand(rand) {
  this.rand = rand;
}
module.exports.Rand = Rand;



Rand.prototype.generate = function generate(len) {
  return this._rand(len);
};

function stringToBytes(str) {
	var ch, st, re = []; 
	for (var i = 0; i < str.length; i++ ) { 
			ch = str.charCodeAt(i);  // get char  
			st = [];                 // set up "stack"  
		 do {  
					st.push( ch & 0xFF );  // push byte to stack  
					ch = ch >> 8;          // shift value down by 1 byte  
			}    
			while ( ch );  
			// add stack contents to result  
			// done because chars have "wrong" endianness  
			re = re.concat( st.reverse() ); 
	}  
	// return an array of bytes  
	return re;  
}

function randomWord(randomFlag, min, max){
    var str = "",
        range = min,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
 
    // 随机产生
    if(randomFlag){
        range = Math.round(Math.random() * (max-min)) + min;
    }
    for(var i=0; i<range; i++){
        var pos = Math.round(Math.random() * (arr.length-1));
        str += arr[pos];
    }
    return str;
}

// Emulate crypto API using randy
Rand.prototype._rand = function _rand(n) {
//   if (this.rand.getBytes)
//     return this.rand.getBytes(n);
		
  var res = new Uint8Array(n);
  for (var i = 0; i < res.length; i++)
    res[i] = stringToBytes(randomWord(false, 1))
    // res[i] = this.rand.getByte();
		
		return res
};

if (typeof self === 'object') {
  if (self.crypto && self.crypto.getRandomValues) {
    // Modern browsers
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.crypto.getRandomValues(arr);
      return arr;
    };
  } else if (self.msCrypto && self.msCrypto.getRandomValues) {
    // IE
    Rand.prototype._rand = function _rand(n) {
      var arr = new Uint8Array(n);
      self.msCrypto.getRandomValues(arr);
      return arr;
    };

  // Safari's WebWorkers do not have `crypto`
  } else if (typeof window === 'object') {
    // Old junk
    Rand.prototype._rand = function() {
      throw new Error('Not implemented yet');
    };
  }
} else {
  // Node.js or Web worker with no crypto support
  try {
    var crypto = require('crypto');
    if (typeof crypto.randomBytes !== 'function')
      throw new Error('Not supported');

    Rand.prototype._rand = function _rand(n) {
      return crypto.randomBytes(n);
    };
  } catch (e) {
  }
}
