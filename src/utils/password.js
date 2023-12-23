const config = require("../configs/config.json");
const crypto = require("node:crypto");

function Password(value, algorithm, secret, digest) {
    const data = {
      algorithm : algorithm || config.crypto.algorithm,
      secret : secret || config.crypto.secret,
      digest : digest || config.crypto.digest
    };
  
    if (value == null) {
      throw new ReferenceError("'value' is null or undefined.");
    }
    value = crypto.createHmac(data.algorithm, data.secret).update(value).digest(data.digest);
  
    this.toString = function() {
      return value;
    };
  
    this.valueOf = function() {
      return value;
    };
  
    return this;
  }

  module.exports = Password;
  