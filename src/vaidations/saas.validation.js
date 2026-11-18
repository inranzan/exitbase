import z from "zod";

// create saas validation
export const createSaasSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "name must be at least 2 characters")
        .max(200),
    url: z.string().trim().url("must be a valid url"),
    description: z
        .string()
        .trim()
        .min(10, "description must be at least 10 characters"),
    revenue: z.coerce
        .number()
        .min(0, "revenue must be greater than or equal to 0"),
});

// update saas validation
export const updateSaasSchema = z
    .object({
        name: z
            .string()
            .trim()
            .min(2, "name must be at least 2 characters")
            .max(200)
            .optional(),
        url: z.string().trim().url("must be a valid url").optional(),
        description: z
            .string()
            .trim()
            .min(10, "description must be at least 10 characters")
            .optional(),
        revenue: z.coerce
            .number()
            .min(0, "revenue must be greater than or equal to 0")
            .optional(),
    })
    .refine(
        data => Object.keys(data).length > 0,
        "at least one field must be provided to update"
    );
