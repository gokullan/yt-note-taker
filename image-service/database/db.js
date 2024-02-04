const pg = require("pg");
const config = require("../../config.json");

const pool = new pg.Pool({
    host: config.image_service.db.host,
    user: config.image_service.db.user,
    password: config.image_service.db.password,
    database: config.image_service.db.database,
})

exports.query = (text, params, callback) => {
    return pool.query(text, params, callback);
}
