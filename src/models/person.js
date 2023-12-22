// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");
const Name = require("./name.js");
const Aggregares = require("./aggregates.js");

/*
    data : {
        person_id : 0,
        person_name_id : 0,
        birthday? : "2000-01-01",
        aggregates? : {
            person_name_id? : {
                name_id : 0,
                first_name : "",
                middle_name? : "",
                last_name? : ""
            }
        }
    }
*/
class Person extends Record {
    constructor(sql, data) {
        super(sql, Person.table, "person_id");
        data = data || {};
        this.data = _.assign(this.data, {
            person_id : data.person_id || data.id || 0,
            person_name_id : data.person_name_id || 0,
            birthday : data.birthday || null,
            aggregates : data.aggregates || {}
        });
        this.data.aggregates.person_name_id = _.assign(this.data.aggregates.person_name_id || {}, {id : this.data.person_name_id});
        this.aggregates.add("person_name_id", new Name(this.sql, this.data.aggregates.person_name_id));
        return this;
    }

    get birthday() {
        return this.data.birthday;
    }

    set birthday(value) {
        this.data.birthday = value;
    }

    get name() {
        return this.aggregates.get("person_name_id");
    }

    set name(value) {
        if (!value) {
            throw new ReferenceError("Name must not be null.");
        }
        if (!(value instanceof Name)) {
            throw new TypeError("Assignment must be a Name instance.");
        }
        this.aggregates.set("person_name_id", value);
        this.data.person_name_id = value ? value.id : 0;
    }

    async create() {
        let result = null;

        await this.aggregates.create();
        result = await this.crud.create(this.data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async delete() {
        let result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        await this.aggregates.delete();
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
        await this.aggregates.read();
        return this;
    }

    async update() {
        let result = null;
        let data = _.assign({}, this.data);

        if (!data.person_name_id) {     // if no entity id was supplied grab the existing one and use that
            delete data.person_name_id;
        }
        result = await this.crud.update(data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        this.aggregates.get("person_name_id").data.name_id = this.data.person_name_id;      // update aggregate id prior tom setting new data
        await this.aggregates.update();
        return this;
    }
}

Person.table = "persons";

module.exports = Person;
