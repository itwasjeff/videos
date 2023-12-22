class SQLError extends Error {
    constructor() {
        super("A SQL error has occured.");
        this.name = "SQLError";
        return this;
    }
}

module.exports = SQLError;
