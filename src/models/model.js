// import config from "../configs/config.json";
// import postgres from "postgres";

const config = require("../configs/config.json");
const postgres = require("postgres");
const Postgres = require("../services/crud/postgres.js");

class Model {
    constructor(sql, table, idcol) {
        sql = sql || postgres(Model.defaults.connection);
        this.crud = new Postgres(sql, table, idcol);
        this.aggregates = {};
        this.data = {[idcol] : null};
        this.idcol = idcol;
    }

    get id() {
        return this.data[this.idcol];
    }

    get isClosed() {
        return this.sql.closed;
    }

    async create() {
        throw new ReferenceError("'create' is not implemented.");
    }

    async delete() {
        throw new ReferenceError("'delete' is not implemented.");
    }

    async read(id) {
        throw new ReferenceError("'read' is not implemented.");
    }

    async update() {
        throw new ReferenceError("'update' is not implemented.");
    }
}

Model.defaults = {
    connection : JSON.parse(JSON.stringify(config.db.connection)),      // quick and dirty deep copy (we want consumer to be able to change Model defaults)
    database : config.db.connection.database,
    timeout : config.db.timeout
};

Model.table = "";

module.exports = Model;
