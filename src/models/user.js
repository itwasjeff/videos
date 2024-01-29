const config = require("../configs/config.json");
const _ = require("lodash/object");
const Record = require("./record.js");
const Person = require("./person.js");
// const Password = require("../services/security/password.js");

/*
    data : {
        user_id : 0,
        user_person_id : 0,
        email : "",
        password : "",
        Person : {
            person_id : 0,
            person_name_id : 0,
            birthday? : "0000-00-00",
            Name : {
                name_id : 0,
                first_name : "",
                middle_name? : "",
                last_name? : ""
            }
        }
    }
*/
class User extends Record {
    constructor(first, data, sql) {
        super(first, User.table, User.idcol, sql);
        data = data || {};
        this.data = _.assign(this.data, {
            user_id : data.user_id || data.id || 0,
            user_person_id : data.user_person_id || 0,
            email : data.email || ""
            // password : ""       // THIS MUST BE SET EXPLICITLY VIA PROPERTY
        });
        this.items.Person = new Person(this, data.Person);
        return this;
    }

    get email() {
        return this.data.email;
    }

    set email(value) {
        if (!value) {
            throw new ReferenceError("'email' must not be null or empty.");
        }
        this.data.email = value;
    }

    get password() {
        return this.data.password;
    }

    set password(value) {
        if (!value) {
            throw new ReferenceError("'password' must not be null or empty.");
        }
        this.data.password = value;
    }

    get Person() {
        return this.items.Person;
    }

    set Person(value) {
        if (!value) {
            throw new ReferenceError("'value' is null or undefined.");
        } else if (!(value instanceof Person)) {
            throw new TypeError("'value' must be a Person instance.");
        }
        this.items.Person = value;
    }

    async create() {
        let result = null;

        if (this.data.user_person_id) {       // existing Person fk being used
            await this.items.Person.read(this.data.user_person_id);     // populate Person
        } else {        // we have to assume Person data was pased
            await this.items.Person.create();       // create new Person
            this.data.user_person_id = this.items.Person.data.person_id;
        }
        result = await this.crud.create(this.data, ["user_person_id", "email", "password"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async delete() {
        let result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        this.data.user_id = 0;
        return this;
    }

    async read(id) {
        let result = null;

        if (id) {
            this.data.user_id = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        await this.items.Person.read(this.data.user_person_id);
        return this;
    }

    toJSON() {
        return _.assign({}, _.omit(this.data, ["password"]), {Person : this.items.Person.toJSON()});
    }

    async update() {
        let result = null;

        if (!this.data.user_person_id) {     // if no entity id was supplied grab the existing one and use that
            delete this.data.user_person_id;
        }
        result = await this.crud.update(this.data, ["user_person_id", "email", "password"]);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data).concat("user_person_id")));      // assign properties from result only if it's already a property of this.data and remember to explicitly add person_name_id since we deleted it
        this.items.Person.data.person_id = this.data.user_person_id;
        await this.items.Person.update();
        return this;
    }
}

User.table = "users";
User.idcol = "user_id";

module.exports = User;
