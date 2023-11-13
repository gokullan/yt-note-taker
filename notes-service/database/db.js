const pg = require("pg");

const pool = new pg.Pool({
    host: 'localhost',
    user: 'notetaker_admin',
    password: 'sS@It^39',
    database: 'notetaker',
})

exports.query = (text, params, callback) => {
    return pool.query(text, params, callback);
}