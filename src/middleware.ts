import "./types" // Import types to extend Express Request interface
import * as jwt from "jsonwebtoken"
import { JWTService } from "./backend-common/jwt"
import type { Request, Response, NextFunction } from "express"

export function middleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1]

  if (!token) {
    res.status(401).json({ message: "No token provided" })
    return
  }

  try {
    const decoded = JWTService.verifyToken(token)
    req.userId = decoded.userId
    req.userEmail = decoded.email
    req.userName = decoded.name
    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" })
    } else {
      res.status(401).json({ message: "Invalid token" })
    }
  }
}
