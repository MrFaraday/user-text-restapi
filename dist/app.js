var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const refreshTokens = [];
const add = (user) => __awaiter(this, void 0, void 0, function* () {
    refreshTokens.push(user);
});
const find = (token) => __awaiter(this, void 0, void 0, function* () {
    return refreshTokens.find((el, index, arr) => el.token === token);
});
const remove = (user) => __awaiter(this, void 0, void 0, function* () {
    const index = refreshTokens.indexOf(user);
    refreshTokens.splice(index, 1);
});
module.exports = {
    add,
    find,
    remove
};
const uuid = require('uuid').v4;
const jwt = require('jsonwebtoken');
const refreshService = require('./refreshService');
process.env.NODE_ENV === 'production' || require('dotenv').config();
const SECRET = process.env.SECRET;
const issueToken = (userId) => __awaiter(this, void 0, void 0, function* () {
    const newRefreshToken = uuid();
    refreshService.add({
        token: newRefreshToken,
        userId
    });
    return {
        access_token: jwt.sign({ id: userId }, SECRET, { expiresIn: 3600 }),
        refreshToken: newRefreshToken,
        expiresIn: 3600
    };
});
module.exports = { issueToken };
const { issueToken } = require('../services/authService');
const refreshService = require('../services/refreshService');
const bcrypt = require('bcryptjs');
module.exports = (app) => {
    const collections = app.locals.collections;
    app.post('/auth', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(401).json({ message: 'No data provided' });
            return;
        }
        const user = yield collections['users'].findOne({ name }, { fields: { password: 1 } });
        if (!user || !bcrypt.compareSync(password, user.password)) {
            res.status(403).json({ message: 'Incorrect username or password' });
            return;
        }
        res.json(yield issueToken(user._id));
    }));
    app.post('/refresh', (req, res) => __awaiter(this, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        const user = yield refreshService.find(refreshToken);
        if (!user) {
            res.status(403).json({ message: 'Wrong token' });
            return;
        }
        const userId = user.userId;
        yield refreshService.remove(user);
        res.json(yield issueToken(userId));
    }));
};
const jwt = require('jsonwebtoken');
process.env.NODE_ENV === 'production' || require('dotenv').config();
const SECRET = process.env.SECRET;
module.exports = () => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.token) {
                res.status(401).json({ message: 'Unathorized' });
                return;
            }
            jwt.verify(req.token, SECRET);
            next();
        }
        catch (e) {
            res.status(403).json({ message: 'Forbidden' });
        }
    });
};
const bearerToken = require('express-bearer-token');
const authorization = require('../middlewares/autorization');
module.exports = (app) => {
    const collections = app.locals.collections;
    app.get(/^\/users(\/[0-9]*)?$/, bearerToken(), authorization(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            pageFromURL = req.originalUrl.match(/\d\d*/g) || []; // извлекаем номер страницы, если нет - пустой массив
            const page = parseInt(pageFromURL[0]) || 1; // т.к. у null не массив, то вверху присваевам пустой и здесь не ловим ошибку
            const users_size = yield collections['users'].countDocuments();
            // 3 users on page
            let totalPages = Math.floor(users_size / 3);
            users_size % 3 === 0 || totalPages++;
            if (totalPages < page)
                return res.status(400).json({ message: 'Incorrect page' });
            const users = yield collections['users'].find()
                .project({ password: 0 })
                .skip((page - 1) * 3)
                .limit(3)
                .toArray();
            for (const user of users) {
                const text = yield collections['text'].find({ user_id: user._id }).toArray();
                user.texts = text;
            }
            res.json({
                users,
                page,
                totalPages,
                usersCount: users_size
            });
        }
        catch (e) {
            res.status(500).json({ message: 'Server Error' });
            console.log(e);
        }
    }));
};
const bearerToken = require('express-bearer-token');
const authorization = require('../middlewares/autorization');
module.exports = (app) => {
    const collections = app.locals.collections;
    app.get(/^\/\w{4,16}$/, bearerToken(), authorization(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const userName = req.originalUrl.split('/')[1]; // извлекаем имя пользователя
            const user = yield collections['users'].findOne({ name: userName }, { fields: { password: 0 } });
            if (!user) {
                res.status(400).json({ message: 'User not found' });
                return;
            }
            const text = yield collections['text'].find({ user_id: user._id }).toArray();
            res.json(Object.assign(Object.assign({}, user), { text }));
        }
        catch (e) {
            res.status(500).json({ message: 'Server Error' });
            console.log(e);
        }
    }));
};
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
process.env.NODE_ENV === 'production' || require('dotenv').config(); // for development
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
    if (err)
        return console.log(err);
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
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.render('index');
}));
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
