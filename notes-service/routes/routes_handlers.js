const db = require('../database/db');
const rmq = require('../send.js');
const api_key = "YOUR_API_KEY";
const redis = require("redis");

let redisClient;
(async () => {
  redisClient = redis.createClient();

  redisClient.on("error", (error) => console.error(`Error : ${error}`));

  await redisClient.connect();
})();

exports.youtubeInfo = async function(request, h) {
    try {
        const youtubeId = request.params.youtubeID;
        const cacheResults = await redisClient.get(youtubeId);
        if (cacheResults) {
            return JSON.parse(cacheResults);
        }
        var response = await fetch(
            `https://youtube.googleapis.com/youtube/v3/videos?part=snippet&id=${youtubeId}&key=${api_key}`
        );
        response = await response.json();
        redisClient.set(youtubeId, JSON.stringify({
            "title": response['items'][0]['snippet']["title"],
            "thumbnails": response['items'][0]['snippet']["thumbnails"]
        }
        ), {
            EX: 3600
        });
        return response['items'][0]['snippet'];
    }
    catch(e) {
        console.log(e);
    }
}

exports.list = async function(request, h) {
    try {
        const result = (await db.query(
            "SELECT * FROM video_list WHERE username = $1",
            [request.params.username]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.new = async function(request, h) {
    try {
        const result = (await db.query(
            "INSERT INTO video_list (username, youtube_id) VALUES ($1, $2) RETURNING video_id",
            [
                request.params.username,
                request.payload.youtubeId,
            ]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.write = async function(request, h) {
    try {
        const result = (await db.query(
            "INSERT INTO notes (video_id, timestamp_, note_) VALUES ($1, $2, $3) RETURNING note_id",
            [
                request.payload.videoId,
                request.payload.timestamp,
                request.payload.note
            ]
        )).rows;
        const noteId = result[0]["note_id"];
        if (request.payload.file != undefined) {
            const image_id = (await db.query(
                "INSERT INTO image64 (base64_code, note_id) VALUES ($1, $2)",
                [
                    request.payload.file.split(',')[1],
                    noteId,
                ]
            ));
            rmq.putInQueue(noteId);
        }
        console.log("Request succeeded");
	    return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.fetch = async function(request, h) {
    try {
        const result = (await db.query(
            "SELECT * FROM NOTES WHERE video_id = $1",
            [request.payload.videoId]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.update = async function(request, h) {
    try {
        const result = (await db.query(
            "UPDATE notes SET note_ = $1 WHERE note_id = $2",
            [
		    request.payload.note,
		    request.payload.noteId
	    ]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.delete = async function(request, h) {
    try {
        const result = (await db.query(
            "DELETE FROM notes WHERE note_id = $1",
            [request.payload.noteId]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.imageDel = async function(request, h){
    try {
        const result = (await db.query(
            "DELETE FROM image64 WHERE img_id = $1",
            [request.payload.imgId]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.imageURL = async function(request, h){
    try {
        const result = (await db.query(
            "INSERT INTO imageURLs (img_id, url) VALUES ($1, $2) RETURNING img_id",
            [
                request.payload.imgId,
                request.payload.url
            ]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}

exports.getImageURL = async function(request, h) {
    try {
        const result = (await db.query(
            "SELECT url FROM imageurls WHERE img_id IN (SELECT img_id from image64 WHERE note_id = $1)",
            [request.payload.noteId]
        )).rows;
        return result;
    }
    catch(e) {
        console.log(e);
    }
}
