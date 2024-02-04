const pg = require("pg");
const config = require("../../config.json");

const pool = new pg.Pool({
    host: config.notes_service.db.host,
    user: config.notes_service.db.user,
    password: config.notes_service.db.password,
    database: config.notes_service.db.database,
})

exports.query = (text, params, callback) => {
    return pool.query(text, params, callback);
}
