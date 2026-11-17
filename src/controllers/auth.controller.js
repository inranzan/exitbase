import { formatValidationError } from "../utils/format.js";
import { signinSchema, signupSchema } from "../vaidations/auth.validation.js";
import logger from "../config/logger.js";
import { createUser, authenticateUser } from "../services/auth.service.js";
import { signToken } from "../utils/jwt.js";
import { cookies } from "../utils/cookies.js";

// POST: /api/auth/sign-up
export const signup = async (req, res, next) => {
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation Error",
                details: formatValidationError(validationResult.error),
            });
        }

        const { name, email, password, role } = validationResult.data;
        const user = await createUser({ name, email, password, role });

        // changed from jwt.sign to signToken imported from jwt.js
        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        cookies.set(res, "token", token);

        logger.info(`User registered successfully: ${email}`);

        return res.status(201).json({
            message: "User registered successfully.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        logger.error("Signup error", error);

        if (
            error.statusCode === 409 ||
            error.message.includes("already exists")
        ) {
            return res.status(409).json({
                error: "User with this email already exists.",
            });
        }

        next(error);
    }
};

// POST: /api/auth/login
export const login = async (req, res, next) => {
    try {
        const validationResult = signinSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation Error",
                details: formatValidationError(validationResult.error),
            });
        }

        const { email, password } = validationResult.data;
        const user = await authenticateUser({ email, password });

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        cookies.set(res, "token", token);

        logger.info(`User logged in successfully: ${email}`);

        return res.status(200).json({
            message: "Login successful.",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        logger.error("Login error", error);

        if (error.statusCode === 401) {
            return res.status(401).json({
                error: "Invalid email or password.",
            });
        }

        next(error);
    }
};

// POST: /api/auth/logout
export const logout = async (req, res, next) => {
    try {
        cookies.clear(res, "token");

        logger.info("User logged out successfully.");

        return res.status(200).json({
            message: "Logged out successfully.",
        });
    } catch (error) {
        logger.error("Logout error", error);
        next(error);
    }
};
