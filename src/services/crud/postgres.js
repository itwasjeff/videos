const config = require("../../configs/config.json");
const _ = require("lodash/collection");
const postgres = require("postgres");
const Crud = require("./crud.js");

class Postgres extends Crud {
    constructor(sql, table, idcol) {
        super();
        this.sql = sql || postgres(config.db.connection);
        if (!table) {
            throw new ReferenceError("table is null or undefied.");
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
            throw new Error("A record with id '" + data[this.idcol] + "' already exists.");
        }
        result = await this.sql`
            insert into ${this.sql(this.table)}
            ${this.sql(data, _.filter(fields, (field) => {
                return data[field] != undefined;
            }))}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    };

    async delete(data) {
        let result = null;

        if (isNaN(data[this.idcol])) {
            throw new TypeError("This record does not exist.");
        }
        result = await this.sql`
            update ${this.sql(this.table)}
            set deleted_date = ${this.sql`now()`}
            where name_id = ${data[this.idcol]}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    };

    async read(data) {
        let result = null;

        if (isNaN(data[this.idcol])) {
            throw new TypeError("A record's id must be a positive integer.");
        }
        result = await this.sql`
            select *
            from ${this.sql(this.table)}
            where ${this.sql(this.idcol)} = ${data[this.idcol]}
            limit 1;
        `;
        return !result || !result.length ? null : result[0];
    }

    async update(data, fields) {
        let result = null;

        if (isNaN(data[this.idcol])) {
            throw new TypeError("This record does not exist.");
        }
        result = await this.sql`
            update ${this.sql(this.table)}
            set ${this.sql(data, _.filter(fields, (field) => {
                return data[field] != undefined;
            }))}
            where ${this.sql(this.idcol)} = ${data[this.idcol]}
            returning *
        `;
        return !result || !result.length ? null : result[0];
    }
}

module.exports = Postgres;
