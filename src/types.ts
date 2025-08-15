// Global type declarations for Express Request interface
declare global {
  namespace Express {
    interface Request {
      userId?: string
      userEmail?: string
      userName?: string
    }
  }
}

export {}
