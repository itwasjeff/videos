const Enum = require("./enum.js");

/*
    data : {
        genre_id : 0,
        name : ""
    }
*/
class Genre extends Enum {
    constructor(sql, data) {
        super(sql, data, Genre.table, "genre_id");
        return this;
    }
}

Genre.table = "genres";

module.exports = Genre;
