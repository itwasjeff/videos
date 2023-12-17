// import {Record} from "./record.js"

const _ = require("lodash/object");
const Record = require("./record.js");
const Name = require("./name.js");
const Aggregate = require("./aggregate.js");

class Person extends Record {
    constructor(sql, id) {
        super(sql, Person.table, "person_id");
        this.aggregates = _.assign(this.aggregates, {
            Name : new Name(this.sql)
        });
        this.data = _.assign(this.data, {
            person_id : isNaN(id) ? 0 : id,
            person_name_id : 0,
            birthday : null
        });
        return this;
    }

    get birthday() {
        return this.data.birthday;
    }

    set birthday(value) {
        this.data.birthday = value;
    }

    get Name() {
        return this.aggregates.Name;
    }

    set Name(value) {
        if (!value) {
            throw new ReferenceError("Name must not be null.");
        }
        if (!(value instanceof Name)) {
            throw new TypeError("Assignment must be a Name instance.");
        }
        this.aggregates.Name = value;
    }

    async create() {
        let result = null;

        if (!this.aggregates.Name.id)  {
            await this.aggregates.Name.create();
        }
        this.data.person_name_id = this.aggregates.Name.id;
        result = await this.crud.create(this.data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async delete() {
        let result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        if (!isNaN(this.aggregates.Name.id)) {
            await this.aggregates.Name.delete();
        }
        return this;
    }

    async read(id) {
        let result = null;

        if (!isNaN(id)) {
            this.data.person_id = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        await this.aggregates.Name.read(this.data.person_name_id);
        return this;
    }

    async update() {
        let result = null;

        if (this.aggregates.Name.id) {
            await this.aggregates.Name.update();
        }
        result = await this.crud.update(this.data, ["person_name_id", "birthday"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }
}

Person.table = "persons";

module.exports = Person;
