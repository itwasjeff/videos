// import {Model} from "./model.js";

const _ = require("lodash/object");
const Crud = require("../services//crud/crud.js");
const Model = require("./model.js");
const Aggregates = require("./aggregates.js");

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
    constructor(first, table, idcol, sql) {
        super(getSqlInstance(first, sql), table, idcol);
        this.data = _.assign(this.data, {
            aggregates : {},
            created_date : null,
            modified_date : null,
            deleted_date : null
        });
        this.parent = first instanceof Record ? first : null;
        this.aggregates = new Aggregates(this);     // we want to redesign to eliminate use of aggregates member
        return this;
    }

    /*
    constructor(sql, table, idcol, parent) {
        super(sql, table, idcol);
        this.data = _.assign(this.data, {
            aggregates : {},
            created_date : null,
            modified_date : null,
            deleted_date : null
        });
        this.parent = parent || null;
        this.aggregates = new Aggregates(this);
        return this;
    }
    */

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

Record.table = "";

module.exports = Record;
