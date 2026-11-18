import { eq, desc } from "drizzle-orm";
import { db } from "../config/database.js";
import logger from "../config/logger.js";
import { saas } from "../models/saas.model.js";
import { users } from "../models/user.model.js";

// create new saas listing
export const createSaas = async ({
    user_id,
    name,
    url,
    description,
    revenue,
}) => {
    try {
        const [newSaas] = await db
            .insert(saas)
            .values({
                user_id,
                name: name.trim(),
                url: url.trim(),
                description: description.trim(),
                revenue: revenue.toString(),
            })
            .returning();

        logger.info(`saas listing created: ${name} by user ${user_id}`);
        return newSaas;
    } catch (error) {
        logger.error("error creating saas listing", error);
        throw error;
    }
};

// get all saas listings
export const fetchAllSaas = async () => {
    try {
        const listings = await db
            .select({
                id: saas.id,
                name: saas.name,
                url: saas.url,
                description: saas.description,
                revenue: saas.revenue,
                created_at: saas.created_at,
                updated_at: saas.updated_at,
                seller: {
                    id: users.id,
                    name: users.name,
                    email: users.email,
                },
            })
            .from(saas)
            .leftJoin(users, eq(saas.user_id, users.id))
            .orderBy(desc(saas.created_at));

        return listings;
    } catch (error) {
        logger.error("error fetching all saas listings", error);
        throw error;
    }
};

// get single saas by id
export const fetchSaasById = async id => {
    try {
        const [listing] = await db
            .select({
                id: saas.id,
                name: saas.name,
                url: saas.url,
                description: saas.description,
                revenue: saas.revenue,
                created_at: saas.created_at,
                updated_at: saas.updated_at,
                seller: {
                    id: users.id,
                    name: users.name,
                    email: users.email,
                },
            })
            .from(saas)
            .leftJoin(users, eq(saas.user_id, users.id))
            .where(eq(saas.id, id))
            .limit(1);

        return listing || null;
    } catch (error) {
        logger.error(`error fetching saas with id ${id}`, error);
        throw error;
    }
};

// update saas by id
export const updateSaasById = async (id, updateData) => {
    try {
        const fieldsToUpdate = {};

        if (updateData.name !== undefined)
            fieldsToUpdate.name = updateData.name.trim();
        if (updateData.url !== undefined)
            fieldsToUpdate.url = updateData.url.trim();
        if (updateData.description !== undefined)
            fieldsToUpdate.description = updateData.description.trim();
        if (updateData.revenue !== undefined)
            fieldsToUpdate.revenue = updateData.revenue.toString();

        fieldsToUpdate.updated_at = new Date();

        const [updatedSaas] = await db
            .update(saas)
            .set(fieldsToUpdate)
            .where(eq(saas.id, id))
            .returning();

        logger.info(`saas listing updated: ${id}`);
        return updatedSaas;
    } catch (error) {
        logger.error(`error updating saas with id ${id}`, error);
        throw error;
    }
};

// delete saas by id
export const deleteSaasById = async id => {
    try {
        const [deletedSaas] = await db
            .delete(saas)
            .where(eq(saas.id, id))
            .returning({ id: saas.id, name: saas.name });

        logger.info(`saas listing deleted: ${id}`);
        return deletedSaas;
    } catch (error) {
        logger.error(`error deleting saas with id ${id}`, error);
        throw error;
    }
};
