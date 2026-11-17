import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import logger from "../config/logger.js";
import { db } from "../config/database.js";
import { users } from "../models/user.model.js";

export const hashPassword = async password => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error("Failed to hash password", error);
        throw error;
    }
};

export const comparePassword = async (password, hashedPassword) => {
    try {
        return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
        logger.error("Failed to compare password", error);
        throw error;
    }
};

// find user by email
export const findUserByEmail = async email => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.email, normalizedEmail))
            .limit(1);

        return user || null;
    } catch (error) {
        logger.error("Error finding user by email", error);
        throw error;
    }
};

// creating a new user
export const createUser = async ({ name, email, password, role = "user" }) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await findUserByEmail(normalizedEmail);

        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }

        const hashedPassword = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({
                name: name.trim(),
                email: normalizedEmail,
                password: hashedPassword,
                role,
            })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
            });

        logger.info(`User ${normalizedEmail} created successfully.`);
        return newUser;
    } catch (error) {
        logger.error("Error creating the user", error);
        throw error;
    }
};

// user authentication service
export const authenticateUser = async ({ email, password }) => {
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await findUserByEmail(normalizedEmail);

        if (!user) {
            const error = new Error("Invalid email or password.");
            error.statusCode = 401;
            throw error;
        }

        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            const error = new Error("Invalid email or password.");
            error.statusCode = 401;
            throw error;
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            created_at: user.created_at,
        };
    } catch (error) {
        logger.error("Error authenticating user", error);
        throw error;
    }
};
