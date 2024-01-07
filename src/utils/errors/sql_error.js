class SQLError extends Error {
    constructor(msg, error) {
        super(msg || "A SQL error has occured.");
        this.error = error || null;
        this.name = "SQLError";
        return this;
    }
}

module.exports = SQLError;
