// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");

/*
    data : {
        name_id : 0,
        first_name : "",
        middle_name? : "",
        last_name? : ""
    }
*/
class Name extends Record {
    constructor(first, data, sql) {
        super(first, Name.table, Name.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, {
            name_id : data.name_id || data.id || 0,
            first_name : data.first_name || "",
            middle_name : data.middle_name || null,
            last_name : data.last_name || null
        });
        return this;
    }

    get first() {
        return this.data.first_name;
    }

    set first(value) {
        this.data.first_name = value || "";
    }

    get last() {
        return this.data.last_name;
    }

    set last(value) {
        this.data.last_name = value || null;
    }

    get middle() {
        return this.data.middle_name;
    }

    set middle(value) {
        this.data.middle_name = value || null;
    }

    async create() {
        const result = await this.crud.create(this.data, ["first_name", "middle_name", "last_name"]);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async delete() {
        const result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        this.data.name_id = 0;
        return this;
    }

    async read(id) {
        let result = null;

        if (id && !isNaN(id)) {
            this.data.name_id = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    toJSON() {
        return _.assign({}, this.data);
    }

    async update() {
        const result = await this.crud.update(this.data, ["first_name", "middle_name", "last_name"]);
        
        // this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        this.data = _.assign(this.data, result);
        return this;
    }
}

Name.table = "names";
Name.idcol = "name_id";

module.exports = Name;
