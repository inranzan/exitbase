import z, { email } from "zod";

export const signupSchema = z.object({
    name: z.string().trim().min(4),
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
    role: z.enum(["user", "admin"]).default("user"),
});

export const signinSchema = z.object({
    email: z.email().max(255).toLowerCase().trim(),
    password: z.string().min(6).max(128),
});
