const Enum = require("./enum.js");

/*
    data : {
        genre_id : 0,
        name : ""
    }
*/
class Genre extends Enum {
    constructor(sql, data) {
        super(sql, data, Genre.defaults.table, Genre.defaults.idcol);
        return this;
    }
}

Genre.defaults = {
    idcol : "genre_id",
    table : "genres"
};

module.exports = Genre;
