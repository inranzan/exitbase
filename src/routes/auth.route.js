import express from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";

const router = express.Router();

// Register
router.post("/sign-up", signup);

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

export default router;
