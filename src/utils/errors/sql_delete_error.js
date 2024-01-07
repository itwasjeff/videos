const SQLError = require("./sql_error");

class SQLDeleteError extends SQLError {
    constructor(table, message, data, error) {
        super("Delete failed on table '" + table + "': " + message + ".", error);
        this.name = "SQLDeleteError";
        this.data = data || {};
        return this;
    }    
}

module.exports = SQLDeleteError;
