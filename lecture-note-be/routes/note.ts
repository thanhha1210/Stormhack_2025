import express from "express";
import multer from "multer";
import path from "path";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";

const router = express.Router();

// --- Multer Configuration ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    // Create a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/**
 * POST /api/notes
 * Upload a new lecture note PDF.
 * Body: FormData with 'file' (the PDF) and 'course' (the course ID)
 */
router.post("/", verifyUser, upload.single("file"), async (req: any, res) => {
  await connectDB();

  const { course } = req.body; // course ID from FormData
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  if (!course) {
    return res.status(400).json({ error: "Missing course ID" });
  }

  try {
    const note = await LectureNote.create({
      user: req.user._id,
      course: course,
      title: file.originalname, // Use original filename as title
      pdfUrl: file.path, // Save the path to the file
    });

    res.status(201).json({
      message: "Lecture note uploaded successfully",
      note,
    });
  } catch (err) {
    console.error("Error creating note:", err);
    res.status(500).json({ error: "Failed to upload lecture note" });
  }
});

/**
 * GET /api/notes
 * Fetch all lecture notes belonging to the logged-in user.
 */
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();

  try {
    const notes = await LectureNote.find({ user: req.user._id }).populate("quizRefs");
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

export default router;