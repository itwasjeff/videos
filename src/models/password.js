// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");
const Hasher = require("../services/security/password/hasher.js");

/*
    data : {
        name_id : 0,
        first_name : "",
        middle_name? : "",
        last_name? : ""
    }
*/
class Password extends Record {
    constructor(first, data, sql) {
        super(first, Password.defaults.table, Password.defaults.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, _.pick(data, _.keys(Password.defaults.fields).concat(Password.defaults.idcol, "id")));
        return this;
    }

    get value() {
        return this.data.value;
    }

    set value(value) {
        if (!value) {
            throw new ReferenceError("'value' is null or empty.");
        }
        
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

Password.defaults = {
    fields : {
        password_user_id : 0,
        value : ""
    },
    idcol : "password_id",
    table : "passwords"
};

module.exports = Password;
