const SQLError = require("./sql_error");

class SQLCreateError extends SQLError {
    constructor(table, message, data) {
        super("'" + table + "' record could not be created: " + message + ".");
        this.name = "SQLCreateError";
        this.data = data || {};
        return this;
    }    
}

module.exports = SQLCreateError;
