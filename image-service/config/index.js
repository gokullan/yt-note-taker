const Cloud = require('@google-cloud/storage')
const path = require('path')
const serviceKey = path.join(__dirname, './inspired-rock-372909-62c78dd7d6bd.json');

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: 'inspired-rock-372909',
})

module.exports = storage