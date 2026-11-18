import express from "express";
import {
    getAllListings,
    getListingById,
    createListing,
    updateListing,
    deleteListing,
} from "../controllers/saas.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// get all saas listings
router.get("/", getAllListings);

// get single saas listing
router.get("/:id", getListingById);

// create saas listing
router.post("/", authenticate, createListing);

// update saas listing
router.put("/:id", authenticate, updateListing);
router.patch("/:id", authenticate, updateListing);

// delete saas listing
router.delete("/:id", authenticate, deleteListing);

export default router;
