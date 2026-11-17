import { eq } from "drizzle-orm";
import { db } from "../config/database.js";
import logger from "../config/logger.js";
import { users } from "../models/user.model.js";
import { hashPassword, findUserByEmail } from "./auth.service.js";

// Fetch all users
export const fetchAllUsers = async () => {
    try {
        const allusers = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            })
            .from(users);

        return allusers;
    } catch (error) {
        logger.error("Error fetching all users from database", error);
        throw error;
    }
};

// find user by id
export const findUserById = async id => {
    try {
        const [user] = await db
            .select({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            })
            .from(users)
            .where(eq(users.id, id))
            .limit(1);

        return user || null;
    } catch (error) {
        logger.error("Error finding user by id", error);
        throw error;
    }
};

// update user by id
export const updateUserById = async (id, updateData) => {
    try {
        const existingUser = await findUserById(id);
        if (!existingUser) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }

        const fieldsToUpdate = {};

        if (updateData.name !== undefined) {
            fieldsToUpdate.name = updateData.name.trim();
        }

        if (updateData.email !== undefined) {
            const normalizedEmail = updateData.email.toLowerCase().trim();
            const emailOwner = await findUserByEmail(normalizedEmail);
            if (emailOwner && emailOwner.id !== id) {
                const error = new Error(
                    "Email is already taken by another account."
                );
                error.statusCode = 409;
                throw error;
            }
            fieldsToUpdate.email = normalizedEmail;
        }

        if (updateData.password !== undefined) {
            fieldsToUpdate.password = await hashPassword(updateData.password);
        }

        if (updateData.role !== undefined) {
            fieldsToUpdate.role = updateData.role;
        }

        fieldsToUpdate.updated_at = new Date();

        const [updatedUser] = await db
            .update(users)
            .set(fieldsToUpdate)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                name: users.name,
                email: users.email,
                role: users.role,
                created_at: users.created_at,
                updated_at: users.updated_at,
            });

        logger.info(`User ${id} updated successfully.`);
        return updatedUser;
    } catch (error) {
        logger.error(`Error updating user ${id}:`, error);
        throw error;
    }
};

// delete user by id
export const deleteUserById = async id => {
    try {
        const existingUser = await findUserById(id);
        if (!existingUser) {
            const error = new Error("User not found.");
            error.statusCode = 404;
            throw error;
        }

        const [deletedUser] = await db
            .delete(users)
            .where(eq(users.id, id))
            .returning({
                id: users.id,
                email: users.email,
            });

        logger.info(`User ${id} deleted successfully.`);
        return deletedUser;
    } catch (error) {
        logger.error(`Error deleting user ${id}:`, error);
        throw error;
    }
};
