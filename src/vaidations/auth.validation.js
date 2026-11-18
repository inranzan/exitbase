import z from "zod";

// user signup validation
export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters")
        .max(200),
    email: z
        .string()
        .email("Invalid email address")
        .max(255)
        .toLowerCase()
        .trim(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .max(128),
    role: z.enum(["user", "admin"]).default("user"),
});

// signin validation
export const signinSchema = z.object({
    email: z
        .string()
        .email("Invalid email address")
        .max(255)
        .toLowerCase()
        .trim(),
    password: z.string().min(1, "Password is required").max(128),
});
