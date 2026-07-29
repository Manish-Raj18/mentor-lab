import express from "express";
import * as aiController from "../controllers/aiController.js";
import * as ttsController from "../controllers/ttsController.js";

const router = express.Router();

router.post("/chat", aiController.chat);
router.post("/explain", aiController.explainNote);
router.post("/tts", ttsController.tts);

export default router;
