const Hapi = require('@hapi/hapi');
const db = require('./database/db');
const uploadImage = require('./helpers/helper').uploadImage;

(async () => {
    const server = Hapi.Server({
        host: 'localhost',
        port: 9001,
        "routes": {
            "cors": true
        }
    });

    server.route({
        method: 'POST',
        path: '/createURL',
        handler: async (request, h) => {
            try {
                console.log("createURL ", request.payload.noteId);
                const base64 = (await db.query(
                    "SELECT * FROM image64 WHERE note_id = $1",
                    [request.payload.noteId]
                )).rows[0]['base64_code'];
                const url = await uploadImage(`${request.payload.noteId}.png`, base64);
                console.log(`Image uploaded at ${url}`);
                return url;
            }
            catch(e) {
                console.log(e);
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/insertURL',
        handler: async (request, h) => {
            try {
                const result = (await db.query(
                    "UPDATE notes SET img_url = $1 WHERE note_id = $2",
                    [
                        request.payload.imgUrl,
                        request.payload.noteId
                    ]
                ))
                return result;
            }
            catch(e) {
                console.log(e);
            }
        }
    });

    server.route({
        method: 'POST',
        path: '/delete64',
        handler: async (request, h) => {
            try {
                const result = (await db.query(
                    "DELETE FROM image64 WHERE note_id = $1",
                    [
                        request.payload.noteId
                    ]
                ));
                return result;
            }
            catch(e) {
                console.log(e);
            }
        }
    })

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
})();