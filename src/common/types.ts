import { z } from "zod"

export const CreateUserSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

export const SigninSchema = z.object({
  username: z.string().email(),
  password: z.string().min(1),
})

export const CreateRoomSchema = z.object({
  name: z.string().min(1),
})

export type CreateUserType = z.infer<typeof CreateUserSchema>
export type SigninType = z.infer<typeof SigninSchema>
export type CreateRoomType = z.infer<typeof CreateRoomSchema>
