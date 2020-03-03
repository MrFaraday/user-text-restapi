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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
process.env.NODE_ENV === 'production' || require('dotenv').config(); // for development
const SECRET = process.env.SECRET;
exports.authorization = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.token) {
                res.status(401).json({ message: 'Unathorized' });
                return;
            }
            jsonwebtoken_1.default.verify(req.token, SECRET);
            next();
        }
        catch (e) {
            res.status(403).json({ message: 'Forbidden' });
        }
    });
};
exports.default = exports.authorization;
//# sourceMappingURL=autorization.js.map