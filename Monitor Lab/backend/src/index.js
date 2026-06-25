import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./db.js"; 
import authroutes from "../routes/authRoutes.js";
import adminRoutes from "../routes/adminRoutes.js";
import mockTestRoutes from "../routes/mockTestRoutes.js";
import notesRoutes from "../routes/notesRoutes.js";
import aiRoutes from "../routes/aiRoutes.js";

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
app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".pdf")) {
            res.set("Content-Disposition", "inline");
        }
    }
}));

const port = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});