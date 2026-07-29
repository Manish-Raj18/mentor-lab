import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./db.js"; 
import authroutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import mockTestRoutes from "../routes/mockTestRoutes.js";
import notesRoutes from "../routes/notesRoutes.js";
import pyqRoutes from "../routes/pyqRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config();
const app = express();

// Middleware configuration
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authroutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mocktest", mockTestRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/pyq", pyqRoutes);
app.use("/api/ai", aiRoutes);

const uploadsDir = path.join(rootDir, "uploads");
app.use("/uploads", express.static(uploadsDir, {
    setHeaders: (res, p) => {
        if (p.endsWith(".pdf")) {
            res.set("Content-Disposition", "inline");
        }
    }
}));

const frontendDist = path.resolve(rootDir, "..", "frontend", "dist");
app.use(express.static(frontendDist));

app.get("/{*path}", (req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
});

const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});