const Enum = require("./enum.js");

/*
    data : {
        producer_type_id : 0,
        name : ""
    }
*/
class ProducerType extends Enum {
    constructor(sql, data) {
        super(sql, data, ProducerType.defaults.table, ProducerType.defaults.idcol);
        return this;
    }
}

ProducerType.defaults = {
    idcol : "producer_type_id",
    table : "producer_types"
};

module.exports = ProducerType;
