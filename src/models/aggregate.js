const _ = require("lodash/object");
const Model = require("./model.js");

class Aggregate {
    constructor(instance, include) {
        this.instance = instance;
        this.include = _.assign(include, Aggregate.defaults.include);
        return this;
    }

    get includes() {
        return this.include;
    }

    get value() {
        return this.instance;
    }
}

Aggregate.defaults = {
    include : {
        create : 0,
        delete : 0,
        read : 0,
        update : 0
    }
};

module.exports = Aggregate;
