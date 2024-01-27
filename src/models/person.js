// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");
const Name = require("./name.js");

/*
    data : {
        person_id : 0,
        person_name_id : 0,
        birthday? : "2000-01-01",
        Name? : {
            name_id : 0,
            first_name : "",
            middle_name : "",
            last_name : ""
        }
    }
*/
class Person extends Record {
    constructor(first, data, sql) {
        super(first, Person.table, Person.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, {
            person_id : data.person_id || data.id || 0,
            person_name_id : data.person_name_id || 0,
            birthday : data.birthday || null
        });
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
        result = await this.crud.create(this.data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async delete() {
        let result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
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
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
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
        result = await this.crud.update(this.data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data).concat("person_name_id")));      // assign properties from result only if it's already a property of this.data and remember to explicitly add person_name_id since we deleted it
        this.items.Name.data.name_id = this.data.person_name_id;
        await this.items.Name.update();
        return this;
    }
}

Person.table = "persons";
Person.idcol = "person_id";

module.exports = Person;
