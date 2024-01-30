// import {Model} from "./model.js";

const _ = require("lodash/object");
const Crud = require("../services//crud/crud.js");
const Model = require("./model.js");

const getSqlInstance = (first, second) => {
    if (second && second instanceof Crud) {
        return second;
    } else if (!first) {
        // no-op
    } else if (first instanceof Crud) {
        return first;
    } else if (first instanceof Record) {
        return first.sql;
    }
    return null;
}

class Record extends Model {
    // first - parent record or crud instance
    // table - table name
    // idcol - name of id column in table
    // sql - optional crud instance to be used instead of any specified in first
    constructor(first, table, idcol, sql) {
        super(getSqlInstance(first, sql), table, idcol);
        this.data = _.assign(this.data, {
            created_date : null,
            modified_date : null,
            deleted_date : null
        });
        this.parent = first instanceof Record ? first : null;
        this.items = {};        // hopefully a simple object can replace Aggregates()
        return this;
    }

    get created() {
        return this.data.created_date;
    }

    get deleted() {
        return this.data.deleted_date;
    }

    get modified() {
        return this.data.modified_date;
    }
}

Record.defaults = {
    fields : {
        created_date : null,
        modified_date : null,
        deleted_date : null
    },
    idcol : "",
    table : ""
};

module.exports = Record;
