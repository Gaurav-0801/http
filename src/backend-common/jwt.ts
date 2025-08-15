import jwt from "jsonwebtoken"

interface TokenPayload {
  userId: string
  email: string
  name: string
}

export class JWTService {
  private static JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
  private static REFRESH_SECRET = process.env.REFRESH_SECRET || "your-refresh-secret"

  static generateTokenPair(payload: TokenPayload) {
    const accessToken = jwt.sign(payload, this.JWT_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign(payload, this.REFRESH_SECRET, { expiresIn: "7d" })

    return { accessToken, refreshToken }
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.JWT_SECRET) as TokenPayload
  }

  static verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, this.REFRESH_SECRET) as TokenPayload
  }
}
