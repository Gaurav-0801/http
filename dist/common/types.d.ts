import { z } from "zod";
export declare const CreateUserSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
    name: string;
}, {
    username: string;
    password: string;
    name: string;
}>;
export declare const SigninSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export declare const CreateRoomSchema: z.ZodObject<{
    name: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
}, {
    name: string;
}>;
export type CreateUserType = z.infer<typeof CreateUserSchema>;
export type SigninType = z.infer<typeof SigninSchema>;
export type CreateRoomType = z.infer<typeof CreateRoomSchema>;
//# sourceMappingURL=types.d.ts.map