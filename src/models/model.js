const config = require("../configs/config.json");
const postgres = require("postgres");
const Postgres = require("../services/crud/postgres.js");
const errors = require("../utils/errors/index.js");

class Model {
    constructor(sql, table, idcol) {
        sql = sql || postgres(Model.defaults.connection);
        this.crud = new Postgres(sql, table, idcol);
        this.data = {[idcol] : null, id : null};
        this.idcol = idcol;
    }

    get id() {
        return this.data[this.idcol] || this.data.id;
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
        return this.data;
    }

    async update() {
        throw new errors.NotImplementedError("update");
    }
}

Model.defaults = {
    connection : JSON.parse(JSON.stringify(config.db.connection)),      // quick and dirty deep copy (we want consumer to be able to change Model defaults)
    database : config.db.connection.database,
    timeout : config.db.timeout
};

Model.table = "";

module.exports = Model;
