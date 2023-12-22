class NotImplementedError extends Error {
    constructor(method) {
        super("'" + method + "' is not implemented.")
        this.name = "NotImplementedError";
        this.method = method;
        return this;
    }
}

module.exports = NotImplementedError;
