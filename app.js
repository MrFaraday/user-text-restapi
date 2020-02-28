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
const bearerToken = require('express-bearer-token');

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;
const PORT = process.env.PORT || 5000;

// services
const authService = require('./src/authService');
const refreshService = require('./src/refreshService');

// middleware auth
const authorization = require('./src/autorization');

const app = express();
const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });

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

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  res.render(`index`);
});

app.post('/auth', async (req, res) => {
  const { name } = req.body;
  const user = await collections['users'].findOne({ name });

  if (!user) {
    res.status(403).json({ message: 'Incorrect' });
    return;
  }

  res.json(await authService.issueToken(user._id));
});

app.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  const user = await refreshService.find(refreshToken);
  if (!user) {
    res.status(403).json({ message: 'Wrong token' });
    return;
  }

  const userId = user.userId;
  await refreshService.remove(user);
  res.json(await authService.issueToken(userId));
});

app.use(bearerToken());
app.use(authorization);

// /users/ route
app.get(/^\/users\/[0-9]*$/, async (req, res) => {
  try {
    pageFromURL = req.originalUrl.match(/\d\d*/g) || [];  // извлекаем номер страницы, если нет - пустой массив
    const page = parseInt(pageFromURL[0]) || 1;  // т.к. у null не массив, то вверху присваевам пустой и здесь не ловим ошибку
    const users_size = await collections['users'].countDocuments();

    // 3 users on page
    let totalPages = Math.floor(users_size / 3);
    users_size % 3 === 0 || totalPages++;
    if (totalPages < page) return res.status(400).json({ message: 'Incorrect page' });

    const users = await collections['users'].find()
      .skip((page - 1) * 3)
      .limit(3)
      .toArray();

    for (const user of users) {
      const text = await collections['text'].find({ user_id: user._id }).toArray();
      user.texts = text;
    }

    res.json({
      users,
      page,
      totalPages,
      usersCount: users_size
    });
  } catch (e) {
    res.status(500).json({ message: 'Server Error' });
    console.log(e);
  }
});

// /user route
app.get(/^\/\w\w*$/, async (req, res) => {
  try {
    const userName = req.originalUrl.split('/')[1];  // извлекаем имя пользователя
    const user = await collections['users'].findOne({ name: userName });

    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    const text = await collections['text'].find({ user_id: user._id }).toArray();

    res.json({
      ...user,
      text
    });
  } catch (e) {
    res.status(500).json({ message: 'Server Error' });
    console.log(e);
  }
});

// on quit
process.on("SIGINT", () => {
  dbClient.close();
  process.exit();
});
