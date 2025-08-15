interface TokenPayload {
    userId: string;
    email: string;
    name: string;
}
export declare class JWTService {
    private static JWT_SECRET;
    private static REFRESH_SECRET;
    static generateTokenPair(payload: TokenPayload): {
        accessToken: string;
        refreshToken: string;
    };
    static verifyToken(token: string): TokenPayload;
    static verifyRefreshToken(token: string): TokenPayload;
}
export {};
//# sourceMappingURL=jwt.d.ts.map