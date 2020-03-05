import express from 'express'
import path from 'path'

// Подключение к БД
import db from './services/dbService'

if (process.env.NODE_ENV !== 'production') require('dotenv').config()  // for development
const PORT = process.env.PORT || 5000

const app = express()

// Подключение middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))

app.get('/', async (req, res) => {
  res.render('index')
})

// /auth
// POST /auth/login
// POST /auth/refresh
app.use('/auth', require('./routes/authentication').default)

// GET /users[/page]
app.use('/users', require('./routes/users').default)

// GET /user/[username]
app.use('/user', require('./routes/user').default)

// on quit
process.on("SIGINT", () => {
  db.dbClient.close()
  process.exit()
})

app.listen(PORT, async () => {
  console.log(`Listening on ${PORT}`)
})
