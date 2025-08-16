import express from "express"
import bcrypt from "bcryptjs"
import { middleware } from "./middleware.js"
import { CreateUserSchema, SigninSchema, CreateRoomSchema } from "./common/types"
import { prismaClient } from "./db/client"
import cors from "cors"
import { JWTService } from "./backend-common/jwt"

const app = express()
app.use(express.json())
app.use(cors())

app.post("/signup", async (req, res) => {
  const parsedData = CreateUserSchema.safeParse(req.body)

  if (!parsedData.success) {
    console.error((parsedData as any).error.format())
    res.status(400).json({ message: "Incorrect inputs" })
    return
  }

  try {
    const hashedPassword = await bcrypt.hash(parsedData.data.password!, 10)
    const user = await prismaClient.user.create({
      data: {
        email: parsedData.data.username!,
        password: hashedPassword,
        name: parsedData.data.name!,
      },
    })

    res.json({ userId: user.id })
  } catch (error: any) {
    console.error("Signup error:", error)

    // Check if it's a Prisma unique constraint violation
    if (error.code === "P2002") {
      res.status(409).json({ message: "User already exists with this email" })
      return
    }

    // Handle other database errors
    res.status(500).json({ message: "Internal server error" })
  }
})

app.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body)

  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect inputs" })
    return
  }

  const user = await prismaClient.user.findFirst({
    where: { email: parsedData.data.username! },
  })

  if (!user || !(await bcrypt.compare(parsedData.data.password!, user.password))) {
    res.status(403).json({ message: "Not authorized" })
    return
  }

  const tokens = JWTService.generateTokenPair({
    userId: user.id,
    email: user.email,
    name: user.name,
  })

  res.json({
    ...tokens,
    user: { id: user.id, name: user.name, email: user.email },
  })
})

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh token required" })
    return
  }

  try {
    const decoded = JWTService.verifyToken(refreshToken)
    const user = await prismaClient.user.findUnique({ where: { id: decoded.userId } })

    if (!user) {
      res.status(401).json({ message: "User not found" })
      return
    }

    const tokens = JWTService.generateTokenPair({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

    res.json(tokens)
  } catch {
    res.status(401).json({ message: "Invalid refresh token" })
  }
})

app.post("/room", middleware, async (req: any, res) => {
  const parsedData = CreateRoomSchema.safeParse(req.body)

  if (!parsedData.success) {
    res.status(400).json({ message: "Incorrect inputs" })
    return
  }

  const userId = req.userId

  try {
    const room = await prismaClient.room.create({
      data: { slug: parsedData.data.name!, adminId: userId },
    })

    res.json({ roomId: room.id })
  } catch {
    res.status(409).json({ message: "Room already exists with this name" })
  }
})

app.get("/chats/:roomId", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId)
    const messages = await prismaClient.chat.findMany({
      where: { roomId },
      orderBy: { id: "desc" },
      take: 1000,
      include: { user: { select: { name: true, id: true } } },
    })

    res.json({ messages })
  } catch (e) {
    console.error(e)
    res.json({ messages: [] })
  }
})

app.get("/room/:slug", async (req, res) => {
  const slug = req.params.slug
  const room = await prismaClient.room.findFirst({
    where: { slug },
    include: { admin: { select: { name: true, id: true } } },
  })

  res.json({ room })
})

app.get("/room/:roomId/elements", async (req, res) => {
  try {
    const roomId = Number(req.params.roomId)
    const elements = await prismaClient.element.findMany({
      where: { roomId },
      orderBy: { timestamp: "asc" },
      include: { user: { select: { name: true, id: true } } },
    })

    res.json({ elements })
  } catch (e) {
    console.error(e)
    res.json({ elements: [] })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`HTTP Server running on port ${PORT}`))
