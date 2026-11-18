import logger from "../config/logger.js";
import { formatValidationError } from "../utils/format.js";
import {
    createSaas,
    fetchAllSaas,
    fetchSaasById,
    updateSaasById,
    deleteSaasById,
} from "../services/saas.service.js";
import {
    createSaasSchema,
    updateSaasSchema,
} from "../vaidations/saas.validation.js";

// list all saas
export const getAllListings = async (req, res, next) => {
    try {
        const listings = await fetchAllSaas();

        return res.status(200).json({
            message: "success getting all saas listings.",
            listings,
            count: listings.length,
        });
    } catch (error) {
        logger.error("error getting all saas listings", error);
        next(error);
    }
};

// get single saas by id
export const getListingById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "bad request",
                message: "invalid id format.",
            });
        }

        const listing = await fetchSaasById(id);
        if (!listing) {
            return res.status(404).json({
                error: "not found",
                message: "saas listing not found.",
            });
        }

        return res.status(200).json({
            listing,
        });
    } catch (error) {
        logger.error(`error fetching saas with id ${req.params.id}`, error);
        next(error);
    }
};

// create saas listing
export const createListing = async (req, res, next) => {
    try {
        const validationResult = createSaasSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                error: "validation error",
                details: formatValidationError(validationResult.error),
            });
        }

        const newListing = await createSaas({
            user_id: req.user.id,
            ...validationResult.data,
        });

        return res.status(201).json({
            message: "saas listed successfully.",
            listing: newListing,
        });
    } catch (error) {
        logger.error("error creating saas listing", error);
        next(error);
    }
};

// update saas listing
export const updateListing = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "bad request",
                message: "invalid id format.",
            });
        }

        const listing = await fetchSaasById(id);
        if (!listing) {
            return res.status(404).json({
                error: "not found",
                message: "saas listing not found.",
            });
        }

        // check if user is owner or admin
        if (listing.seller?.id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                error: "forbidden",
                message: "you are not authorized to update this listing.",
            });
        }

        const validationResult = updateSaasSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "validation error",
                details: formatValidationError(validationResult.error),
            });
        }

        const updated = await updateSaasById(id, validationResult.data);

        return res.status(200).json({
            message: "saas updated successfully.",
            listing: updated,
        });
    } catch (error) {
        logger.error(`error updating saas ${req.params.id}`, error);
        next(error);
    }
};

// delete saas listing
export const deleteListing = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id, 10);
        if (isNaN(id)) {
            return res.status(400).json({
                error: "bad request",
                message: "invalid id format.",
            });
        }

        const listing = await fetchSaasById(id);
        if (!listing) {
            return res.status(404).json({
                error: "not found",
                message: "saas listing not found.",
            });
        }

        // check if user is owner or admin
        if (listing.seller?.id !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({
                error: "forbidden",
                message: "you are not authorized to delete this listing.",
            });
        }

        await deleteSaasById(id);

        return res.status(200).json({
            message: "saas deleted successfully.",
        });
    } catch (error) {
        logger.error(`error deleting saas ${req.params.id}`, error);
        next(error);
    }
};
