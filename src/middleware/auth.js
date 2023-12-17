const config = require("../configs/config.json");
const postgres = require('postgres');
const sql = postgres(config.db.connection);
const express = require('express');
const app = express();
const crypto = require("node:crypto");

module.exports = async (req, res, next) => {
    const userid = req.params.userid;
    const password = req.params.password;
    const hash = crypto("sha256", password).digest("hex");
    const result = await this.sql`
        select password
        from ${sql("video.users")}
        where user_id = ${userid}
        limit 1;
    `;
    result = result[0];
    if (result.password != password) {
        throw new Error("Authentication failed.");
    }
    next();
};
