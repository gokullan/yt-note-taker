const { createFile } = require('../md-to-pdf');
const { login } = require('./login');
const handlers = require('./routes_handlers');

module.exports = function(server) {
    server.route({
        method: 'POST',
        path: '/notes/login',
        handler: login,
    });

    server.route({
        method: 'GET',
        path: '/notes/{youtubeID}',
        handler: handlers.youtubeInfo,
    });

    server.route({
        method: 'GET',
        path: '/notes/{username}/list',
        handler: handlers.list,
        config: { auth: 'jwt' },
    });

    server.route({
        method: 'POST',
        path: '/notes/{username}/new',
        handler: handlers.new,
    })

    server.route({
        method: 'POST',
        path: '/notes/video/fetch',
        handler: handlers.fetch,
    })

    server.route({
        method: 'POST',
        path: '/notes/video/write',
        handler: handlers.write,
        options: {
            payload: {
                multipart: true,
                maxBytes: 2000000,
            }
        }
    })

    server.route({
        method: 'POST',
        path: '/notes/video/update',
        handler: handlers.update,
    })

    server.route({
        method: 'POST',
        path: '/notes/video/delete',
        handler: handlers.delete,
    })

    server.route({
        method: 'POST',
        path: '/notes/image/delete',
        handler: handlers.imageDel,
    })

    server.route({
        method: 'POST',
        path: '/notes/image/urlinsert',
        handler: handlers.imageURL,
    })

    server.route({
        method: "POST",
        path: "/download/test",
        handler: async (request, h) => {
            console.log(request.payload.videoId);
            await createFile(request.payload.videoId);
            console.log("Done");
            return h.file(
                "/home/gmo-gokulas/Documents/video-note-taker/notes-service/hello_world.pdf",
                {mode: "attachment"}
            );
        }   
    })

    server.route({
        method: "POST",
        path: "/image/url",
        handler: handlers.getImageURL,
    })
}


// server.route({
//     method: 'POST',
//     path: '/test',
//     handler: (request, h) => {
//         blob = request.payload.file.split(',')[1];

//         require("fs").writeFile("out.png", blob, 'base64', function(err) {
//             console.log(err);
//           });
//         return "Hello!"
//     },
//     options: {
//         payload: {
//             multipart: true
//         }
//     }
// })