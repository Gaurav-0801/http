"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const middleware_js_1 = require("./middleware.js");
const types_1 = require("@repo/common/types");
const client_1 = require("@repo/db/client");
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("@repo/backend-common/jwt");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post("/signup", async (req, res) => {
    const parsedData = types_1.CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.error(parsedData.error.format());
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(parsedData.data.password, 10);
        const user = await client_1.prismaClient.user.create({
            data: {
                email: parsedData.data.username,
                password: hashedPassword,
                name: parsedData.data.name,
            },
        });
        res.json({ userId: user.id });
    }
    catch {
        res.status(409).json({ message: "User already exists with this username" });
    }
});
app.post("/signin", async (req, res) => {
    const parsedData = types_1.SigninSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    const user = await client_1.prismaClient.user.findFirst({
        where: { email: parsedData.data.username },
    });
    if (!user || !(await bcryptjs_1.default.compare(parsedData.data.password, user.password))) {
        res.status(403).json({ message: "Not authorized" });
        return;
    }
    const tokens = jwt_1.JWTService.generateTokenPair({
        userId: user.id,
        email: user.email,
        name: user.name,
    });
    res.json({
        ...tokens,
        user: { id: user.id, name: user.name, email: user.email },
    });
});
app.post("/refresh", async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        res.status(401).json({ message: "Refresh token required" });
        return;
    }
    try {
        const decoded = jwt_1.JWTService.verifyToken(refreshToken);
        const user = await client_1.prismaClient.user.findUnique({ where: { id: decoded.userId } });
        if (!user) {
            res.status(401).json({ message: "User not found" });
            return;
        }
        const tokens = jwt_1.JWTService.generateTokenPair({
            userId: user.id,
            email: user.email,
            name: user.name,
        });
        res.json(tokens);
    }
    catch {
        res.status(401).json({ message: "Invalid refresh token" });
    }
});
app.post("/room", middleware_js_1.middleware, async (req, res) => {
    const parsedData = types_1.CreateRoomSchema.safeParse(req.body);
    if (!parsedData.success) {
        res.status(400).json({ message: "Incorrect inputs" });
        return;
    }
    const userId = req.userId;
    try {
        const room = await client_1.prismaClient.room.create({
            data: { slug: parsedData.data.name, adminId: userId },
        });
        res.json({ roomId: room.id });
    }
    catch {
        res.status(409).json({ message: "Room already exists with this name" });
    }
});
app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const messages = await client_1.prismaClient.chat.findMany({
            where: { roomId },
            orderBy: { id: "desc" },
            take: 1000,
            include: { user: { select: { name: true, id: true } } },
        });
        res.json({ messages });
    }
    catch (e) {
        console.error(e);
        res.json({ messages: [] });
    }
});
app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await client_1.prismaClient.room.findFirst({
        where: { slug },
        include: { admin: { select: { name: true, id: true } } },
    });
    res.json({ room });
});
app.get("/room/:roomId/elements", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        const elements = await client_1.prismaClient.element.findMany({
            where: { roomId },
            orderBy: { timestamp: "asc" },
            include: { user: { select: { name: true, id: true } } },
        });
        res.json({ elements });
    }
    catch (e) {
        console.error(e);
        res.json({ elements: [] });
    }
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`));
//# sourceMappingURL=app-original.js.map