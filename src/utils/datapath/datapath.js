const errors = require("../errors/index.js");

class DataPath {
    constructor(data, basepath) {
        if (!data) {
            throw new ReferenceError("'data' is null or undefined.");
        }
        this.data = data;
        this.basepath = basepath || "";
    }

    delete(path) {
        throw new errors.NotImplementedError("get");
    }

    get(path, nocreate) {
        throw new errors.NotImplementedError("get");
    }

    has(path) {
        throw new errors.NotImplementedError("has");
    }

    set(path, value) {
        throw new errors.NotImplementedError("set");
    }

    toJSON() {
        throw new errors.NotImplementedError("toJSON");
    }

    toString(path) {
        throw new errors.NotImplementedError("toString");
    }
}

module.exports = DataPath;
