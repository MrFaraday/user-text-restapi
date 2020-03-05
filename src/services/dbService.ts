import { MongoClient } from 'mongodb'
import { Collections } from '../interfaces'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()  // for development
const MONGODB_URI = process.env.MONGODB_URI
const DB_NAME = process.env.MONGODB_NAME

const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true })

let dbClient: MongoClient
const collections: Collections = {}
mongoClient.connect(async (err, client) => {
  if (err) return console.log(err)
  dbClient = client
  const db = client.db(DB_NAME)
  collections.users = db.collection('users')
  collections.text = db.collection('text')
})

export default {
  collections,
  dbClient
}
