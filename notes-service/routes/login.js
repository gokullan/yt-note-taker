const JWT         = require('jsonwebtoken');
const db = require('../database/db');
const secret = 'NeverShareYourSecret';

exports.login = async function(request, h) {
    try {
        const username = request.payload.username;
        const result = (await db.query(
            "SELECT user_id FROM users WHERE username = $1 AND password = $2",
            [
                username,
                request.payload.password
            ]
        )).rows;
        if (result.length) {
            return [{
                "jwt": JWT.sign(username, secret)
            }]
        }
        return result;
    }
    catch(e) {
        console.log(e);
    }
}