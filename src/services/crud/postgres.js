const config = require("../../configs/config.json");
const _ = require("lodash/collection");
const postgres = require("postgres");
const Crud = require("./crud.js");
const errors = require("../../utils/errors/index.js");

class Postgres extends Crud {
    constructor(sql, table, idcol) {
        super();
        this.sql = sql || postgres(config.db.connection);
        if (!table) {
            throw new ReferenceError("table is null or undefined.");
        } else if (!idcol) {
            throw new ReferenceError("idcol is null or undefined.");
        }
        this.table = config.db.connection.database + "." + table;
        this.idcol = idcol;
        this.closed = false;
    }

    get adapter() {
        return this.sql;
    }

    async close(timeout) {
        await this.sql.end(isNaN(timeout) ? config.db.timeout : timeout);
        this.closed = true;
    }

    async create(data, fields) {
        let result = null;

        if (data[this.idcol]) {
            throw new errors.SQLInsertError(this.table, "a record with id '" + data[this.idcol] + "' already exists.", data);
        }
        result = await this.sql`
            insert into ${this.sql(this.table)}
            ${this.sql(data, _.filter(fields, (field) => {
                return data[field] !== undefined;
            }))}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    };

    async delete(data) {
        let result = null;

        if (isNaN(data[this.idcol]) && isNaN(data[Postgres.defaults.idField])) {
            throw new TypeError("This record does not exist.");
        }
        result = await this.sql`
            update ${this.sql(this.table)}
            set deleted_date = ${this.sql`now()`}
            where ${this.sql(this.idcol)} = ${data[this.idcol]}
            or ${this.sql(this.idcol)} = ${data[Postgres.defaults.idField]}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    };

    async read(data) {
        let result = null;

        if (isNaN(data[this.idcol]) && isNaN(data[Postgres.defaults.idField])) {
            throw new TypeError("A record's id must be a positive integer.");
        }
        result = await this.sql`
            select *
            from ${this.sql(this.table)}
            where ${this.sql(this.idcol)} = ${data[this.idcol]}
            or ${this.sql(this.idcol)} = ${data[Postgres.defaults.idField]}
            limit 1;
        `;
        return !result || !result.length ? null : result[0];
    }

    async update(data, fields) {
        let result = null;

        if (isNaN(data[this.idcol]) && isNaN(data[Postgres.defaults.idField])) {
            throw new TypeError("This record does not exist.");
        } else if (!fields.length) {       // edge case handles no-op updates
            return this.read(data);
        }
        result = await this.sql`
            update ${this.sql(this.table)}
            set ${this.sql(data, _.filter(fields, (field) => {
                return data[field] !== undefined;
            }))}
            where ${this.sql(this.idcol)} = ${data[this.idcol]}
            or ${this.sql(this.idcol)} = ${data[Postgres.defaults.idField]}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    }
}

Postgres.defaults = {
    idField : "id"
};

module.exports = Postgres;
