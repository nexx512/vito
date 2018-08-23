const mongoClient = require('mongodb').MongoClient
const MONGODB_URL = 'mongodb://192.168.10.201'
const DATABASE_NAME = 'vitodens'
const COLLECTION_NAME = 'collection'

module.exports = class VitoDB {
  constructor() {

  }

  async getData() {
    let client

    client = await mongoClient.connect(MONGODB_URL, {useNewUrlParser: true})
    const db = client.db(DATABASE_NAME)
    data = await db.collection(COLLECTION_NAME).find({})
    client.close()
  }
}
