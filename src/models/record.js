// import {Model} from "./model.js";

const _ = require("lodash/object");
const Model = require("./model.js");
const Aggregates = require("./aggregates.js");

class Record extends Model {
    constructor(sql, table, idcol) {
        super(sql, table, idcol);
        this.aggregates = new Aggregates(this);
        this.data = _.assign(this.data, {
            aggregates : {},
            created_date : null,
            modified_date : null,
            deleted_date : null
        });
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

Record.table = "";

module.exports = Record;
