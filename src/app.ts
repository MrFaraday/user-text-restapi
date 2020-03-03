/*
 * Необходимо реализовать сервис с следующим функционалом:
 * 1. База данных любая на выбор
 * 2. В базе две связанные таблицы
 * user
 * id — первичный ключ
 * name — название
 * text
 * id — первичный ключ
 * text - текст
 * user_id - связь с пользователем
 * Реализовать 2 REST API метода:
 * GET /user — должен возвращать пользователя с его записями
 * GET /users/ — должен пользователей со всеми их записями, должен поддерживать пагинацию
 * API должно быть закрыто bearer авторизацией.
*/

import express from 'express'
import path from 'path'
import { MongoClient, Collection } from 'mongodb'

import { login_route } from './routes/login'
import { users_route } from './routes/users'
import { user_route } from './routes/user'

process.env.NODE_ENV === 'production' || require('dotenv').config()  // for development
const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_NAME = process.env.MONGODB_NAME
const PORT = process.env.PORT || 5000

const app = express()
const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true })

// Подключение к БД
interface Collections {
  [key: string]: Collection<any>
}

let dbClient: MongoClient
const collections: Collections = {}
app.locals.collections = collections
mongoClient.connect((err, client) => {
  if (err) return console.log(err)
  dbClient = client
  let db = client.db(MONGODB_NAME)
  collections['users'] = db.collection('users')
  collections['text'] = db.collection('text')

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
  })
})

// Подключение middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', async (req, res) => {
  res.render('index')
})

// POST /auth
// POST /refresh
login_route(app)

// GET /users
users_route(app)

// GET /:user
user_route(app)

// on quit
process.on("SIGINT", () => {
  dbClient.close()
  process.exit()
})
