import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";
import { Quiz } from "../models/quizz";

const router = express.Router();

/**
 * POST /api/quizzes
 * Manually add a quiz question to a lecture note.
 */
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { noteId, question, options, answer, type } = req.body;

  if (!noteId || !question || !answer) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // ✅ Verify that the note belongs to the user
    const note = await LectureNote.findById(noteId);
    if (!note || note.user.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized note access" });
    }

    // ✅ Create a new quiz
    const quiz = await Quiz.create({
      user: req.user._id,
      note: new mongoose.Types.ObjectId(noteId),
      question,
      options: options || [],
      answer,
      type: type || "mcq",
    });

    // ✅ Link quiz to lecture note
    note.quizRefs.push(quiz._id);
    await note.save();

    res.json({ message: "Quiz created successfully", quiz });
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({ error: "Failed to create quiz" });
  }
});

/**
 * GET /api/quizzes?noteId=<id>
 * Fetch all quizzes for a specific lecture note.
 */
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const noteId = req.query.noteId;

  if (!noteId) {
    return res.status(400).json({ error: "Missing noteId parameter" });
  }

  try {
    const quizzes = await Quiz.find({
      user: req.user._id,
      note: noteId,
    });
    res.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

/**
 * DELETE /api/quizzes/:id
 * Delete a quiz question (owned by the user).
 */
router.delete("/:id", verifyUser, async (req: any, res) => {
  await connectDB();
  const quizId = req.params.id;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz || quiz.user.toString() !== req.user._id) {
      return res.status(403).json({ error: "Unauthorized quiz deletion" });
    }

    await quiz.deleteOne();

    // Also remove reference from the note
    await LectureNote.updateOne(
      { quizRefs: quizId },
      { $pull: { quizRefs: quizId } }
    );

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({ error: "Failed to delete quiz" });
  }
});

export default router;
