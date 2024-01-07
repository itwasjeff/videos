const SQLError = require("./sql_error");

class SQLInsertError extends SQLError {
    constructor(table, message, data, error) {
        super("Insert failed on table '" + table + "': " + message + ".", error);
        this.name = "SQLInsertError";
        this.data = data || {};
        return this;
    }    
}

module.exports = SQLInsertError;
