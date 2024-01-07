const _ = require("lodash/object");
const errors = require("./errors/index.js");

const construct = (data, path) => {
    if (!path) {
        return data;
    }
    return path.split(DataPath.pathChar).reduce((accumulator, value) => {
        if (value in accumulator) {
            accumulator = accumulator[value];
        } else {
            accumulator = accumulator[value] = {};
        }
        return accumulator;
    }, data);
}

class DataPath {
    constructor(parent, path) {
        this.parent = parent || null;
        this.data = this.parent ? this.parent.data : {};
        this.path = path || "";
        this.instance = construct(this.data, this.path);
        return this;
    }

    assign(path, value) {
        _.assign(construct(this.instance, path), value);
        return this;
    }

    delete(path) {
        if (!path) {
            throw new ReferenceError("'path' must not be empty.");
        }

        const segments = path.split(DataPath.pathChar);     // split path into segments
        const last = segments.pop();        // ensure we have a last segment to delete
        let where = this.instance;      // we also need a starting point

        if (segments.every((value) => {
            if (!(value in where)) {
                return false;       // we found our last segment
            }
            where = where[value];       // move to next segment
            return true;
        })) {
            delete where[last];     // every segment resolved on path, delete the last one
        }
        return this;
    }

    get(path) {
        return construct(this.instance, path);
    }

    has(path) {
        let where = this.instance;
        
        if (!path) {
            return true;
        }
        return path.split(DataPath.pathChar).every((value) => {
            if (!(value in where)) {
                return false;
            }
            where = where[value];
            return true;
        })
    }

    merge(path, value) {
        _.merge(construct(this.instance, path), value);
        return this;
    }

    set(path, value) {
        if (!path) {
            throw new ReferenceError("'path' must not be empty.");
        }

        const segments = path.split(DataPath.pathChar);     // split path into segments
        const last = segments.pop();        // ensure we have a last segment to delete
        const where = construct(this.instance, segments.join(DataPath.pathChar));

        where[last] = value;
        return this;
    }
}

DataPath.pathChar = ".";

module.exports = DataPath;
