"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const mongodb_1 = require("mongodb");
const login_1 = require("./routes/login");
const users_1 = require("./routes/users");
const user_1 = require("./routes/user");
process.env.NODE_ENV === 'production' || require('dotenv').config(); // for development
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;
const PORT = process.env.PORT || 5000;
const app = express_1.default();
const mongoClient = new mongodb_1.MongoClient(MONGODB_URI, { useUnifiedTopology: true });
let dbClient;
const collections = {};
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
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('index');
}));
// POST /auth
// POST /refresh
login_1.login_route(app);
// GET /users
users_1.users_route(app);
// GET /:user
user_1.user_route(app);
// on quit
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
//# sourceMappingURL=app.js.map