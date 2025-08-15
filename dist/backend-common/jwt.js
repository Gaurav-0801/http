"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class JWTService {
    static generateTokenPair(payload) {
        const accessToken = jsonwebtoken_1.default.sign(payload, this.JWT_SECRET, { expiresIn: "15m" });
        const refreshToken = jsonwebtoken_1.default.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" });
        return { accessToken, refreshToken };
    }
    static verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
    }
    static verifyRefreshToken(token) {
        return jsonwebtoken_1.default.verify(token, this.REFRESH_SECRET);
    }
}
exports.JWTService = JWTService;
JWTService.JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
JWTService.REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret";
//# sourceMappingURL=jwt.js.map