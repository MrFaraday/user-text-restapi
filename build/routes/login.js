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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authService_1 = __importDefault(require("../services/authService"));
const refreshService_1 = __importDefault(require("../services/refreshService"));
exports.login_route = (app) => {
    const collections = app.locals.collections;
    app.post('/auth', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { name, password } = req.body;
        if (!name || !password) {
            res.status(401).json({ message: 'No data provided' });
            return;
        }
        const user = yield collections['users'].findOne({ name }, { projection: { password: 1 } });
        if (!user || !bcryptjs_1.default.compareSync(password, user.password)) {
            res.status(403).json({ message: 'Incorrect username or password' });
            return;
        }
        res.json(yield authService_1.default(user._id));
    }));
    app.post('/refresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { refreshToken } = req.body;
        const user = yield refreshService_1.default.find(refreshToken);
        if (!user) {
            res.status(403).json({ message: 'Wrong token' });
            return;
        }
        const userId = user.userId;
        yield refreshService_1.default.remove(user);
        res.json(yield authService_1.default(userId));
    }));
};
//# sourceMappingURL=login.js.map