const Enum = require("./enum.js");

/*
    data : {
        encoder_id : 0,
        name : "",
        description : ""
    }
*/
class Encoder extends Enum {
    constructor(sql, data) {
        super(sql, data, Encoder.table, "encoder_id", ["description"]);
        return this;
    }
}

Encoder.table = "encoders";

module.exports = Encoder;
