"use strict";
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
const express_bearer_token_1 = __importDefault(require("express-bearer-token"));
const autorization_1 = __importDefault(require("../middlewares/autorization"));
exports.users_route = (app) => {
    const collections = app.locals.collections;
    app.get(/^\/users(\/[0-9]*)?$/, express_bearer_token_1.default(), autorization_1.default(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const page = parseInt(req.originalUrl.match(/^\/users(?:\/([0-9]*))?$/)[1]) || 1; // берём страницу изи url или первую, если в url её нет
            const users_size = yield collections['users'].countDocuments();
            // 3 users per page
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
//# sourceMappingURL=users.js.map