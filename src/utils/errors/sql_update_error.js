const SQLError = require("./sql_error");

class SQLUpdateError extends SQLError {
    constructor(table, message, data, error) {
        super("Update failed on table '" + table + "': " + message + ".", error);
        this.name = "SQLUpdateError";
        this.data = data || {};
        return this;
    }    
}

module.exports = SQLUpdateError;
