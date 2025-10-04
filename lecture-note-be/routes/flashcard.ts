import express from "express";
import mongoose from "mongoose";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";
import { Flashcard } from "../models/flashcard";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

/**
 * POST /api/flashcards
 * Body: { noteId, pdfUrl?, imageUrl? }
 */
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const user = req.user;
  const { noteId, pdfUrl, imageUrl } = req.body;

  if (!noteId || (!pdfUrl && !imageUrl)) {
    return res.status(400).json({ error: "Missing noteId or file" });
  }

  try {
    // ✅ Verify lecture note ownership
    const note = await LectureNote.findById(noteId);
    if (!note || note.user.toString() !== user._id) {
      return res.status(403).json({ error: "Unauthorized note access" });
    }

    // ✅ Initialize Gemini client
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    // 🧠 Prompt to extract terms and definitions
    const prompt = `
    You are a study assistant that extracts key terms and definitions for flashcards.

    From the provided lecture note, identify important concepts, technical terms, 
    and their concise definitions.

    Return only valid JSON array in this format:
    [
      {"term": "Thread", "definition": "A lightweight process that shares memory with others."},
      {"term": "Context Switch", "definition": "The act of saving and loading CPU states when switching between threads."}
    ]
    `;

    const inputData = [
      prompt,
      pdfUrl
        ? { fileData: { mimeType: "application/pdf", fileUri: pdfUrl } }
        : { inlineData: { mimeType: "image/png", data: imageUrl } },
    ];

    // 🧩 Generate flashcards with Gemini
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const flashcards = JSON.parse(jsonStr);

    // 💾 Save flashcards to MongoDB
    const savedCards = [];
    for (const c of flashcards) {
      const card = await Flashcard.create({
        user: user._id,
        note: new mongoose.Types.ObjectId(noteId),
        term: c.term,
        definition: c.definition,
      });
      savedCards.push(card);
    }

    return res.json({
      message: "✅ Flashcards generated successfully",
      count: savedCards.length,
      flashcards: savedCards,
    });
  } catch (error) {
    console.error("Gemini flashcard generation error:", error);
    res.status(500).json({ error: "Failed to generate flashcards" });
  }
});

export default router;
