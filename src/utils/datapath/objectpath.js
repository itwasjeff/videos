const _ = require("lodash/object");
const DataPath = require("./datapath.js");

function combine(path) {

}

function construct(data, path) {
    const segments = path.split(ObjectPath.pathChar);
    const result = segments.redu
    segments
}

class ObjectPath extends DataPath {
    constructor(data, basepath) {
        super(data || {}, basepath);
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

ObjectPath.pathChar = ".";

module.exports = ObjectPath;
