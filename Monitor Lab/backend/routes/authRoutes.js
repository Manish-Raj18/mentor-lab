import express from "express";
import { register, login, getProfile, updateProfile, addActivity } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router(); 

// Define authentication API endpoints
router.post("/signup", register);
router.post("/login", login);

// Define profile API endpoints
router.route("/profile")
    .get(protect, getProfile)
    .put(protect, updateProfile);

// Define activity API endpoints
router.post("/add-activity", protect, addActivity);

export default router;