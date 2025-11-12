import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";

const __dirname = path.resolve();

// TEMP LOCAL STORAGE PATH
const RECORDINGS_PATH = path.join(__dirname, "uploads", "recordings");
if (!fs.existsSync(RECORDINGS_PATH)) {
  fs.mkdirSync(RECORDINGS_PATH, { recursive: true });
}

// POST /api/recordings/upload
export const uploadRecording = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const fileId = uuidv4();
    const filePath = path.join(RECORDINGS_PATH, `${fileId}.webm`);
    fs.writeFileSync(filePath, req.file.buffer);

    return res.json({
      message: "Recording saved successfully",
      id: fileId,
      playbackUrl: `/api/recordings/${fileId}`,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/recordings/:id
export const getRecording = async (req, res) => {
  try {
    const { id } = req.params;
    const filePath = path.join(RECORDINGS_PATH, `${id}.webm`);
    if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Recording not found" });

    res.setHeader("Content-Type", "video/webm");
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error("Fetch recording error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
