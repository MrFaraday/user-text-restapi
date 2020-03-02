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

const express = require('express');
const path = require('path');
process.env.NODE_ENV === 'production' || require('dotenv').config();  // for development
const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;
const PORT = process.env.PORT || 5000;

const app = express();
const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

// Подключение к БД
let dbClient;
const collections = [];
app.locals.collections = collections;
mongoClient.connect((err, client) => {
  if (err) return console.log(err);
  dbClient = client;
  let db = client.db(MONGODB_NAME);
  collections['users'] = db.collection('users');
  collections['text'] = db.collection('text');

  app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
  });
});

// Подключение middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', async (req, res) => {
  res.render('index');
});

// POST /auth
// POST /refresh
require('./routes/login')(app);

// GET /users
require('./routes/users')(app);

// GET /:user
require('./routes/user')(app);

// on quit
process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
