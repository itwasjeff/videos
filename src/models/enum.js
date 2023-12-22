const _ = require("lodash/object");
const Model = require("./model.js");

/*
    data : {
        [id] : 0,
        name : "".
        ... : ...
    }
*/
class Enum extends Model {
    constructor(sql, data, table, idcol, fields) {
        super(sql, table, idcol);
        data = data || {};
        this.data = _.assign(this.data, {
            [this.idcol] : data[this.idcol] || data.id || 0
        });
        this.fields = ["name"].concat(fields || []);        // any additional fields we're interested in
        this.fields.forEach((value) => {
            this.data[value] = data[value] || null;
        });
        return this;
    }

    get name() {
        return this.data.name;
    }

    set name(value) {
        if (value == null) {
            throw new ReferenceError("name cannot be null.")
        }
        this.data.name = value;
    }

    async create() {
        const result = await this.crud.create(this.data, this.fields);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    // Enum types can NOT be deleted!
    /*
    async delete() {
        const result = await this.crud.delete(this.data);

        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        this.data[this.idcol] = 0;
        return this;
    }
    */

    async read(id) {
        let result = null;

        if (id && !isNaN(id)) {
            this.data[this.idcol] = id;
        }
        result = await this.crud.read(this.data);
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }

    async update() {
        const result = await this.crud.update(this.data, this.fields);
        
        this.data = _.assign(this.data, _.pick(result, _.keys(this.data)));      // assign properties from result only if it's already a property of this.data
        return this;
    }
}

module.exports = Enum;
