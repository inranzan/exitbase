import { formatValidationError } from "../utils/format.js";
import { signupSchema } from "../vaidations/auth.validation.js";
import logger from "../config/logger.js";
import { createUser } from "../services/auth.service.js";
import jwt from "jsonwebtoken";
import { cookies } from "../utils/cookies.js";

export const signup = async (req, res, next) => {
    try {
        // input validations
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation Error",
                details: formatValidationError(validationResult.error),
            });
        }

        // users signup
        const { name, email, password, role } = validationResult.data;

        const user = await createUser({ name, email, password, role });

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRATION || "1d",
            }
        );

        cookies.set(res, "token", token);

        logger.info(`User registered successfully: ${email}`);

        await res.status(200).json({
            message: "User created successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        logger.error("Signup error", error);

        if (error.message === "User already exists") {
            res.status(409).send({
                error: "User with this email already exists.",
            });
        }

        next(error);
    }
};
