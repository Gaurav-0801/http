"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRoomSchema = exports.SigninSchema = exports.CreateUserSchema = void 0;
const zod_1 = require("zod");
exports.CreateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
    name: zod_1.z.string().min(1),
});
exports.SigninSchema = zod_1.z.object({
    username: zod_1.z.string().email(),
    password: zod_1.z.string().min(1),
});
exports.CreateRoomSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
});
//# sourceMappingURL=types.js.map