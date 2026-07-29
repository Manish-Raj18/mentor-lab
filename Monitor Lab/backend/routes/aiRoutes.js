import express from "express";
import * as aiController from "../controllers/aiController.js";

const router = express.Router();

router.post("/chat", aiController.chat);
router.post("/explain", aiController.explainNote);

export default router;
