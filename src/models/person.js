// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");
const Name = require("./name.js");

/*
    data : {
        person_id : 0,
        person_name_id : 0,
        birthday? : "2000-01-01",
        Name : {
            name_id : 0,
            first_name : "",
            middle_name : "",
            last_name : ""
        }
    }
*/
class Person extends Record {
    constructor(first, data, sql) {
        super(first, Person.defaults.table, Person.defaults.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, _.pick(data, _.keys(Person.defaults.fields).concat(Person.defaults.idcol, "id")));
        this.items.Name = new Name(this, data.Name);
        return this;
    }

    get birthday() {
        return this.data.birthday;
    }

    set birthday(value) {
        this.data.birthday = value;
    }

    get Name() {
        return this.items.Name;
    }

    set Name(value) {
        if (!value) {
            throw new ReferenceError("'value' is null or undefined.");
        } else if (!(value instanceof Name)) {
            throw new TypeError("'value' must be a Name instance.");
        }
        this.items.name = value;
    }

    async create() {
        let result = null;

        await this.items.Name.create();
        this.data.person_name_id = this.items.Name.data.name_id;
        result = await this.crud.create(_.defaults(this.data, Person.defaults.fields), _.keys(Person.defaults.fields));
        this.data = _.assign(this.data, result);
        return this;
    }

    async delete() {
        let result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, result);
        this.items.Name.data.name_id = this.data.person_name_id;
        await this.items.Name.delete();
        this.data.person_id = 0;
        return this;
    }

    async read(id) {
        let result = null;

        if (id) {
            this.data.person_id = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, result);
        await this.items.Name.read(this.data.person_name_id);
        return this;
    }

    toJSON() {
        return _.assign({}, this.data, {Name : this.items.Name.toJSON()});
    }

    async update() {
        let result = null;

        if (!this.data.person_name_id) {     // if no entity id was supplied grab the existing one and use that
            delete this.data.person_name_id;
        }
        result = await this.crud.update(this.data, _.keys(_.pick(this.data, _.keys(Person.defaults.fields))));
        this.data = _.assign(this.data, result);
        this.items.Name.data.name_id = this.data.person_name_id;
        await this.items.Name.update();
        return this;
    }
}

Person.defaults = {
    fields : {
        person_name_id : 0,
        birthday : ""
    },
    idcol : "person_id",
    table : "persons"
};

module.exports = Person;
