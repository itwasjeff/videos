const Enum = require("./enum.js");

/*
    data : {
        format_id : 0,
        name : ""
    }
*/
class Format extends Enum {
    constructor(sql, data) {
        super(sql, data, Format.table, "format_id");
        return this;
    }
}

Format.table = "formats";

module.exports = Format;
