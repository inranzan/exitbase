import express from "express";
import {
    getAllUsers,
    getMe,
    getUserById,
    updateUser,
    deleteUser,
} from "../controllers/users.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// all users
router.get("/", getAllUsers);

// authenticated user profile
router.get("/me", authenticate, getMe);

// get user by ID
router.get("/:id", authenticate, getUserById);

// update user by ID
router.put("/:id", authenticate, updateUser);
// router.patch("/:id", authenticate, updateUser);

// delete user
router.delete("/:id", authenticate, deleteUser);

export default router;
