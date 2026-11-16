import express from "express";
import {
    signup,
    login,
    logout,
    getMe,
} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Register
router.post("/sign-up", signup);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// authenticated user profile
router.get("/me", authenticate, getMe);

export default router;
