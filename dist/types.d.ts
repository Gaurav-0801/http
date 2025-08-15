declare global {
    namespace Express {
        interface Request {
            userId?: string;
            userEmail?: string;
            userName?: string;
        }
    }
}
export {};
//# sourceMappingURL=types.d.ts.map