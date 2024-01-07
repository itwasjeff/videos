const SQLError = require("./sql_error");

class SQLSelectError extends SQLError {
    constructor(table, message, data, error) {
        super("Select failed on table '" + table + "': " + message + ".", error);
        this.name = "SQLSelectError";
        this.data = data || {};
        return this;
    }    
}

module.exports = SQLSelectError;
