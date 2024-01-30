const Enum = require("./enum.js");

/*
    data : {
        tag_id : 0,
        name : ""
    }
*/
class Tag extends Enum {
    constructor(sql, data) {
        super(sql, data, Tag.defaults.table, Tag.defaults.idcol);
        return this;
    }
}

Tag.defaults = {
    idcol : "tag_id",
    table : "tags"
};

module.exports = Tag;
