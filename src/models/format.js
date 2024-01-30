const Enum = require("./enum.js");

/*
    data : {
        format_id : 0,
        name : ""
    }
*/
class Format extends Enum {
    constructor(sql, data) {
        super(sql, data, Format.defaults.table, Format.defaults.idcol);
        return this;
    }
}

Format.defaults = {
    idcol : "format_id",
    table : "formats"
}

module.exports = Format;
