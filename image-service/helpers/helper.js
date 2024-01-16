const util = require('util')
const gc = require('../config')
const bucket = gc.bucket('inspired-rock-372909.appspot.com') // should be your bucket name
const fs = require("fs")

exports.uploadImage = (originalname, base64_) => new Promise((resolve, reject) => {
  const buffer = Buffer.from(base64_, "base64");
  const blob = bucket.file(originalname.replace(/ /g, "_"))
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

exports.saveImageLocal = (originalname, base64_) => {
  const basePath = "/home/gokulakrishnans/yt-note-taker/notes-service";
  const buffer = Buffer.from(base64_, "base64");
  fs.writeFileSync(`${basePath}/notes-images/${originalname}`, buffer);
  return `./notes-images/${originalname}`
}
