import express from "express";
import multer from "multer";
import { uploadRecording, getRecording } from "../controllers/recording.controller.js";

const router = express.Router();

// Use multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });

// POST /api/recordings/upload
router.post("/upload", upload.single("recording"), uploadRecording);

// GET /api/recordings/:id
router.get("/:id", getRecording);

export default router;
