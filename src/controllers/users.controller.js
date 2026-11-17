import logger from "../config/logger.js";
import {
    fetchAllUsers,
    findUserById,
    updateUserById,
    deleteUserById,
} from "../services/users.service.js";
import { updateUserSchema } from "../vaidations/user.validation.js";
import { formatValidationError } from "../utils/format.js";
import { cookies } from "../utils/cookies.js";

// GET /api/users
export const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await fetchAllUsers();

        return res.status(200).json({
            message: "Success getting all users.",
            users: allUsers,
            count: allUsers.length,
        });
    } catch (error) {
        logger.error("Error getting all users: ", error);
        next(error);
    }
};

// GET /api/users/me
export const getMe = async (req, res, next) => {
    try {
        const user = await findUserById(req.user.id);

        if (!user) {
            return res.status(404).json({
                error: "User not found.",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        logger.error("Get current user error", error);
        next(error);
    }
};

// GET /api/users/:id
export const getUserById = async (req, res, next) => {
    try {
        const targetId = parseInt(req.params.id, 10);
        if (isNaN(targetId)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid user ID format. Must be an integer.",
            });
        }

        const user = await findUserById(targetId);
        if (!user) {
            return res.status(404).json({
                error: "Not Found",
                message: "User not found.",
            });
        }

        return res.status(200).json({
            user,
        });
    } catch (error) {
        logger.error(`Error fetching user ${req.params.id}:`, error);
        next(error);
    }
};

// PUT /api/users/:id or PATCH /api/users/:id
export const updateUser = async (req, res, next) => {
    try {
        const targetId = parseInt(req.params.id, 10);
        if (isNaN(targetId)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid user ID format. Must be an integer.",
            });
        }

        // only account owner or admin can update
        if (req.user.id !== targetId && req.user.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden",
                message: "You are not authorized to update this user account.",
            });
        }

        const validationResult = updateUserSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                error: "Validation Error",
                details: formatValidationError(validationResult.error),
            });
        }

        // only admins can change user roles
        if (validationResult.data.role && req.user.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden",
                message: "Only administrators can change user roles.",
            });
        }

        const updatedUser = await updateUserById(
            targetId,
            validationResult.data
        );

        return res.status(200).json({
            message: "User updated successfully.",
            user: updatedUser,
        });
    } catch (error) {
        logger.error(`Error updating user ${req.params.id}:`, error);

        if (error.statusCode === 404) {
            return res.status(404).json({
                error: "Not Found",
                message: error.message,
            });
        }

        if (error.statusCode === 409) {
            return res.status(409).json({
                error: "Conflict",
                message: error.message,
            });
        }

        next(error);
    }
};

// DELETE /api/users/:id
export const deleteUser = async (req, res, next) => {
    try {
        const targetId = parseInt(req.params.id, 10);
        if (isNaN(targetId)) {
            return res.status(400).json({
                error: "Bad Request",
                message: "Invalid user ID format. Must be an integer.",
            });
        }

        // only account owner or admin can delete
        if (req.user.id !== targetId && req.user.role !== "admin") {
            return res.status(403).json({
                error: "Forbidden",
                message: "You are not authorized to delete this user account.",
            });
        }

        await deleteUserById(targetId);

        // user deleted their own account, clear their session cookie
        if (req.user.id === targetId) {
            cookies.clear(res, "token");
        }

        return res.status(200).json({
            message: "User deleted successfully.",
        });
    } catch (error) {
        logger.error(`Error deleting user ${req.params.id}:`, error);

        if (error.statusCode === 404) {
            return res.status(404).json({
                error: "Not Found",
                message: error.message,
            });
        }

        next(error);
    }
};
