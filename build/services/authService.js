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
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshService_1 = __importDefault(require("./refreshService"));
process.env.NODE_ENV === 'production' || require('dotenv').config(); // for development
const SECRET = process.env.SECRET;
exports.issueToken = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const newRefreshToken = uuid_1.v4();
    const user = yield refreshService_1.default.find(userId);
    if (user)
        yield refreshService_1.default.remove(user);
    refreshService_1.default.add({
        token: newRefreshToken,
        userId
    });
    return {
        access_token: jsonwebtoken_1.default.sign({ id: userId }, SECRET, { expiresIn: 3600 }),
        refresh_token: newRefreshToken,
        expires_in: 3600
    };
});
exports.default = exports.issueToken;
//# sourceMappingURL=authService.js.map