const Enum = require("./enum.js");

/*
    data : {
        size_type_id : 0,
        name : ""
    }
*/
class SizeType extends Enum {
    constructor(sql, data) {
        super(sql, data, SizeType.defaults.table, SizeType.defaults.idcol);
        return this;
    }
}

SizeType.defaults = {
    idcol : "size_type_id",
    table : "size_types"
};

module.exports = SizeType;
