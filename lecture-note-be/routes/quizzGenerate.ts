import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";
import { Quiz } from "../models/quizz";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/**
 * POST /api/quizzes/generate
 * Body: { noteId, pdfUrl?, imageUrl? }
 */
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const user = req.user;
  const { noteId, pdfUrl, imageUrl } = req.body;

  // ✅ Validate input
  if (!noteId || (!pdfUrl && !imageUrl))
    return res.status(400).json({ error: "Missing file or noteId" });

  try {
    // ✅ Verify note ownership
    const note = await LectureNote.findById(noteId);
    if (!note || note.user.toString() !== user._id)
      return res.status(403).json({ error: "Unauthorized note access" });

    // ✅ Setup Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // ✅ Build prompt
    const prompt = `
    You are an intelligent quiz generator.
    Based on the following lecture note, generate at least 3 quiz questions.
    Output as *valid JSON* with this structure:
    [
      {"question": "...", "options": ["A","B","C","D"], "answer": "A", "type": "mcq"},
      {"question": "...", "answer": "...", "type": "short"}
    ]
    `;

    // ✅ Send file (PDF or image) to Gemini
    const inputData = [
      prompt,
      pdfUrl
        ? { fileData: { mimeType: "application/pdf", fileUri: pdfUrl } }
        : { inlineData: { mimeType: "image/png", data: imageUrl } },
    ];

    // 🧠 Generate AI content
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // 🧩 Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const quizzes = JSON.parse(jsonStr);

    // 💾 Save quizzes to DB
    const savedQuizzes = [];
    for (const q of quizzes) {
      const quiz = await Quiz.create({
        user: user._id,
        note: new mongoose.Types.ObjectId(noteId),
        question: q.question,
        options: q.options || [],
        answer: q.answer,
        type: q.type || "mcq",
      });
      note.quizRefs.push(quiz._id);
      savedQuizzes.push(quiz);
    }

    await note.save();

    res.json({
      message: "✅ Quizzes generated successfully",
      count: savedQuizzes.length,
      quizzes: savedQuizzes,
    });
  } catch (err) {
    console.error("Gemini quiz generation error:", err);
    res.status(500).json({ error: "Failed to generate quizzes" });
  }
});

export default router;
