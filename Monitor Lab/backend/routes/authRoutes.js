import express from "express";
import {
    register,
    login,
    getProfile,
    updateProfile,
    addActivity,
    forgotPassword,
    verifyResetOtp,
    resetPassword,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router(); 

// Define authentication API endpoints
router.post("/signup", register);
router.post("/login", login);

// Password reset (email verification code)
router.post("/forgot-password", forgotPassword);
router.post("/verify-reset-otp", verifyResetOtp);
router.post("/reset-password", resetPassword);

// Define profile API endpoints
router.route("/profile")
    .get(protect, getProfile)
    .put(protect, updateProfile);

// Define activity API endpoints
router.post("/add-activity", protect, addActivity);

export default router;
