import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";
import { Quiz } from "../models/quizz";
import { Test } from "../models/test";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/**
 * POST /api/tests
 * Body: { noteId, pdfUrl, numMcq?, numShort?, numCode? }
 */
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const user = req.user;
  const { noteId, pdfUrl, numMcq = 5, numShort = 2, numCode = 1 } = req.body;

  if (!noteId || !pdfUrl)
    return res.status(400).json({ error: "Missing noteId or pdfUrl" });

  try {
    // 🔐 Verify ownership of note
    const note = await LectureNote.findById(noteId);
    if (!note || note.user.toString() !== user._id)
      return res.status(403).json({ error: "Unauthorized note access" });

    // 🤖 Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 🧠 Prompt for generating questions
    const prompt = `
    You are an intelligent quiz/test generator.

    Read the provided lecture note (PDF). 
    Generate a total of ${numMcq + numShort + numCode} questions with this breakdown:
    - ${numMcq} multiple-choice questions (MCQ)
    - ${numShort} short-answer questions
    - ${numCode} coding or logic questions

    Format the output as valid JSON array:
    [
      {"question": "...", "options": ["A","B","C","D"], "answer": "B", "type": "mcq"},
      {"question": "...", "answer": "...", "type": "short"},
      {"question": "...", "answer": "...", "type": "code"}
    ]
    Do NOT include explanations or commentary outside the JSON.
    `;

    const inputData = [
      prompt,
      { fileData: { mimeType: "application/pdf", fileUri: pdfUrl } },
    ];

    // ⚙️ Call Gemini
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // 🧩 Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const quizzes = JSON.parse(jsonStr);

    // 📝 Save all quizzes to DB
    const quizRefs: mongoose.Types.ObjectId[] = [];
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
      quizRefs.push(quiz._id);
    }
    await note.save();

    // 🧪 Create Test record
    const test = await Test.create({
      user: user._id,
      title: `${note.title} - Auto Test`,
      description: `Auto-generated from lecture note`,
      quizRefs,
      totalQuestions: quizRefs.length,
    });

    return res.json({
      message: "✅ Test generated successfully",
      testId: test._id,
      totalQuestions: quizRefs.length,
    });
  } catch (error) {
    console.error("Gemini test generation error:", error);
    res.status(500).json({ error: "Failed to generate test" });
  }
});

export default router;
