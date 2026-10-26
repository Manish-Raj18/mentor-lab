import express from "express";
import { submitContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// Public endpoint: the Contact Us form on the website.
router.post("/", submitContactMessage);

export default router;
