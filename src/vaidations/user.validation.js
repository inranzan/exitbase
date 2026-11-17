import z from "zod";

export const updateUserSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(200)
            .optional(),
        email: z
            .string()
            .email("Invalid email address")
            .max(255)
            .toLowerCase()
            .trim()
            .optional(),
        password: z
            .string()
            .min(6, "Password must be at least 6 characters")
            .max(128)
            .optional(),
        role: z.enum(["user", "admin"]).optional(),
    })
    .refine(
        data => Object.keys(data).length > 0,
        "At least one field (name, email, password, or role) must be provided to update."
    );
