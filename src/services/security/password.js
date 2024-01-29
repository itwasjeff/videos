const config = require("../../configs/config.json");
const crypto = require("node:crypto");

class Password {
    constructor(algorithm, secret, digest) {
        this.algorithm = algorithm || config.crypto.algorithm;
        this.secret = secret || config.crypto.secret;
        this.digest = digest || config.crypto.digest;
    }

    hash(value) {
        if (value == null) {
          throw new ReferenceError("'value' is null or undefined.");
        }
        return crypto.createHmac(this.algorithm, this.secret).update(value).digest(this.digest);
    }

    // TODO - add rules logic to test plain pass
}

module.exports = Password;
