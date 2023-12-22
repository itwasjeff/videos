const _ = require("lodash/collection");
const Model = require("./model.js");

class Aggregates {
    constructor(owner) {
        this.owner = owner;
        this.items = {/* owner member name for this : aggregate model instance */};
        return this;
    }

    add(name, value) {
        if (name in this.items) {
            return false;
        }
        this.items[name] = value;
        return true;
    }

    async create() {
/*
        const results = await _.map(this.items, async (value, name) => {
            if (!value.id) {
                await value.create();
                this.owner.data[name] = value.id;      // set aggregate id in data
                this.owner.data.aggregates[name] = value.data;     // populate entire aggregate in data
            }
            return value;
        });
*/

        for (let i in this.items) {
            if (!this.items[i].id) {
                await this.items[i].create();
                this.owner.data[i] = this.items[i].id;      // set aggregate id in data
                this.owner.data.aggregates[i] = this.items[i].data;     // populate entire aggregate in data
            }
        }
    }

    async delete() {
        for (let i in this.items) {
            if (this.owner.data[i]) {
                this.owner.data.aggregates[i] = {id : this.owner.data[i]}
                this.items[i].data.id = this.owner.data[i];
                await this.items[i].delete();
                delete this.items[i].data.id;
                this.owner.data.aggregates[i] = this.items[i].data;
            }
        }
    }

    get(name) {
        return this.items[name];
    }

    async read() {
        for (let i in this.items) {
            if (this.owner.data[i]) {
                await this.items[i].read(this.owner.data[i]);
                this.owner.data.aggregates[i] = this.items[i].data;
            }
        }
    }

    remove(name) {
        if (!(name in this.items)) {
            return false;
        }
        delete this.items[name];
        return true;
    }

    set(name, value) {
        this.items[name] = value;
        return value;
    }

    async update() {
        for (let i in this.items) {
            if (this.items[i].id) {
                await this.items[i].update();
                this.owner.data.aggregates[i] = this.items[i].data;
            }
        }
    }
}

module.exports = Aggregates;
