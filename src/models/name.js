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
        super(first, Name.defaults.table, Name.defaults.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, _.pick(data, _.keys(Name.defaults.fields).concat(Name.defaults.idcol, "id")));
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
        const result = await this.crud.create(_.defaults(this.data, Name.defaults.fields), _.keys(Name.defaults.fields));

        this.data = _.assign(this.data, result);
        return this;
    }

    async delete() {
        const result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, result);
        this.data.name_id = 0;
        return this;
    }

    async read(id) {
        let result = null;

        if (id) {
            this.data.name_id = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, result);
        return this;
    }

    toJSON() {
        return _.assign({}, this.data);
    }

    async update() {
        const result = await this.crud.update(this.data, _.keys(_.pick(this.data, _.keys(Name.defaults.fields))));

        this.data = _.assign(this.data, result);
        return this;
    }
}

Name.defaults = {
    fields : {
        first_name : "",
        middle_name : null,
        last_name : null
    },
    idcol : "name_id",
    table : "names"
};

module.exports = Name;
