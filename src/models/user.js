const config = require("../configs/config.json");
const _ = require("lodash/object");
const Record = require("./record.js");
const Person = require("./person.js");
const Password = require("../utils/password.js");

class User extends Record {
    constructor(sql, data) {
        super(sql, User.table, "user_id");
        data = data || {};
        this.data = _.assign(this.data, {
            user_id : data.user_id || data.id || 0,
            user_person_id : data.user_person_id || 0,
            email : "",
            password: "",
            aggregates : data.aggregates || {}
        });
        this.data.aggregates.user_person_id = _.assign(this.data.aggregates.user_person_id || {}, {id : this.data.user_person_id});
        this.aggregates.add("user_person_id", new Person(this.sql, this.data.aggregates.user_person_id));
        return this;
    }

    get email() {
        return this.data.email;
    }

    set email(value) {
        if (!value) {
            throw new ReferenceError("'email' must not be null.");
        }
        this.data.email = email;
    }

    set password(value) {
        if (!value) {
            throw new ReferenceError("'password' must not be null or empty.");
        }
        this.data.password = new Password(value).toString();
    }

    get person() {
        return this.aggregates.get("user_person_id");
    }

    set person(value) {
        if (!value) {
            throw new ReferenceError("Person must not be null.");
        }
        if (!(value instanceof Person)) {
            throw new TypeError("Assignment must be a Person instance.");
        }
        this.aggregates.set("user_person_id", value);
        this.data.user_person_id = value ? value.id : 0;
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

User.table = "users";

module.exports = User;
