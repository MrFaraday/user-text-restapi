var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const express = require('express');
const path = require('path');
process.env.NODE_ENV === 'production' || require('dotenv').config();
const { MongoClient } = require('mongodb');
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_NAME = process.env.MONGODB_NAME;
const PORT = process.env.PORT || 5000;
const app = express();
const mongoClient = new MongoClient(MONGODB_URI, { useUnifiedTopology: true });
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
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => __awaiter(this, void 0, void 0, function* () {
    res.render('index');
}));
require('./src/routes/login')(app);
require('./src/routes/users')(app);
require('./src/routes/user')(app);
process.on("SIGINT", () => {
    dbClient.close();
    process.exit();
});
//# sourceMappingURL=app.js.map