const _ = require("lodash/object");
const config = require("../configs/config.json");
const postgres = require("postgres");
const Postgres = require("../services/crud/postgres.js");
const errors = require("../utils/errors/index.js");

class Model {
    constructor(sql, table, idcol) {
        sql = sql || postgres(Model.defaults.db.connection);
        this.crud = new Postgres(sql, table, idcol);
        this.data = {[idcol] : null, [Model.defaults.idcol] : null};
        this.idcol = idcol;
    }

    get id() {
        return this.data[this.idcol] || this.data.id;
    }

    set id(value) {
        if (value == null) {
            throw new ReferenceError("'value' is null or undefined.");
        } else if (isNaN(value) || value < 0) {
            throw new RangeError("'value' must be a positive integer.");
        }
        this.data[this.idcol] = this.data.id = value;
    }

    get isClosed() {
        return this.sql.closed;
    }

    async create() {
        throw new errors.NotImplementedError("create");
    }

    async delete() {
        throw new errors.NotImplementedError("delete");
    }

    async read(id) {
        throw new errors.NotImplementedError("read");
    }

    toJSON() {
        return _.assign({}, this.data);
    }

    async update() {
        throw new errors.NotImplementedError("update");
    }
}

Model.defaults = {
    db : {
        connection : JSON.parse(JSON.stringify(config.db.connection)),      // quick and dirty deep copy (we want consumer to be able to change Model defaults)
        timeout : config.db.timeout
    },
    fields : {

    },
    idcol : "id",
    table : ""
};

module.exports = Model;
