const _ = require("lodash/object");
const Enum = require("./enum.js");

/*
    data : {
        setting_id : 0,
        name : "",
        value : ""
    }
*/
class Setting extends Enum {
    constructor(sql, data) {
        super(sql, data, Setting.defaults.table, Setting.defaults.idcol, _.keys(Setting.defaults.fields));
        return this;
    }
}

Setting.defaults = {
    fields : {
        value : ""
    },
    idcol : "setting_id",
    table : "settings"
};

module.exports = Setting;
