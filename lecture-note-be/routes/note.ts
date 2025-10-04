import express from "express";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";

const router = express.Router();

/**
 * POST /api/notes
 * Upload or create a new lecture note.
 * Body: { courseId, title, pdfUrl }
 */
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();

  const { courseId, title, pdfUrl } = req.body;

  if (!title || !pdfUrl) {
    return res.status(400).json({ error: "Missing title or pdfUrl" });
  }

  try {
    const note = await LectureNote.create({
      user: req.user._id,
      courseId,
      title,
      pdfUrl,
    });

    res.json({
      message: "Lecture note uploaded successfully",
      id: note._id,
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
