const _ = require("lodash/object");
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
        super(sql, data, Encoder.defaults.table, Encoder.defaults.idcol, _.keys(Encuder.defaults.fields));
        return this;
    }
}

Encoder.defaults = {
    fields : {
        description : ""
    },
    idcol : "encoder_id",
    table : "encoders"
};

module.exports = Encoder;
