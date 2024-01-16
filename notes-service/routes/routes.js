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
        options: {
          description: "Returns the thumbnail-URL and title of provided YouTube-video ID",
          tags: ["api"]
        }
    });

    server.route({
        method: 'GET',
        path: '/notes/{username}/list',
        handler: handlers.list,
        // config: { auth: 'jwt' },
        options: {
          auth: "jwt",
          description: "Returns list of videos associated with the user",
          tags: ["api"]
        }
    });

    server.route({
        method: 'POST',
        path: '/notes/{username}/new',
        handler: handlers.new,
        options: {
          description: "Creates a new video-entry for the user",
          tags: ["api"]
        }
    })

    server.route({
        method: 'POST',
        path: '/notes/video/fetch',
        handler: handlers.fetch,
        options: {
          description: "Get all associated notes with the video",
          tags: ["api"]
        }
    })

    server.route({
        method: 'POST',
        path: '/notes/video/write',
        handler: handlers.write,
        options: {
            payload: {
                multipart: true,
                maxBytes: 2000000,
            },
            tags: ["api"],
            description: "Save given note"
        }
    })

    server.route({
        method: 'POST',
        path: '/notes/video/update',
        handler: handlers.update,
        options: {
          description: "Update given note",
          tags: ["api"]
        }
    })

    server.route({
        method: 'POST',
        path: '/notes/video/delete',
        handler: handlers.delete,
        options: {
          description: "Delete given note",
          tags: ["api"]
        }
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
                "/home/gokulakrishnans/yt-note-taker/notes-service/hello_world.pdf",
                {mode: "attachment"}
            );
        },
        options: {
          description: "Download notes in the form of a pdf",
          tags: ["api"]
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
