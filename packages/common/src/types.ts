import { z } from "zod";
import { email } from "zod/v4";

export const CreateUserSchema = z.object({
    name: z.string().min(3, {
        message: "name must be of atleast 3 characters"
    }),
    password: z.string(),
    email: z.string()
})

export const SigninSchema = z.object({
    email: z.string(),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})