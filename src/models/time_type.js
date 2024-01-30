const Enum = require("./enum.js");

/*
    data : {
        time_type_id : 0,
        name : ""
    }
*/
class TimeType extends Enum {
    constructor(sql, data) {
        super(sql, data, TimeType.defaults.table, TimeType.defaults.idcol);
        return this;
    }
}

TimeType.defaults = {
    idcol : "time_type_id",
    table : "time_types"
};

module.exports = TimeType;
