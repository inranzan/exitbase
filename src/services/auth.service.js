import { eq } from "drizzle-orm";
import logger from "../config/logger.js";
import bcrypt from "bcrypt";
import { db } from "../config/database.js";
import { users } from "../models/user.model.js";

export const hashPassword = async password => {
    try {
        return await bcrypt.hash(password, 10);
    } catch (error) {
        logger.error("Failed to hash password.");
    }
};

export const createUser = async ({ name, email, password, role = "user" }) => {
    try {
        const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, email))
            .limit(1);

        if (existingUser.length > 1) {
            throw new Error("User already exists.");
        }

        const hash_password = await hashPassword(password);

        const [newUser] = await db
            .insert(users)
            .values({ name, email, password: hash_password, role })
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
            });

        logger.info(`User ${email} created successfully.`);

        return newUser;
    } catch (error) {
        logger.error("Error creating the user", error);
        throw error;
    }
};
