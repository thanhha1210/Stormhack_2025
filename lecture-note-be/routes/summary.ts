import express from "express";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";
import { LectureNote } from "../models/note";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// POST /api/summary
// Body: { noteId, pdfUrl?, imageUrl? }
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { noteId, pdfUrl, imageUrl } = req.body;

  if (!noteId || (!pdfUrl && !imageUrl))
    return res.status(400).json({ error: "Missing noteId or file URL" });

  try {
    const note = await LectureNote.findById(noteId);
    if (!note || note.user.toString() !== req.user._id)
      return res.status(403).json({ error: "Unauthorized note access" });

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `
      Summarize the key concepts, definitions, and important takeaways from this lecture note.
      Use clear paragraphs and bullet points. Output in plain text, no markdown.
    `;

    const input = [
      prompt,
      pdfUrl
        ? { fileData: { mimeType: "application/pdf", fileUri: pdfUrl } }
        : { inlineData: { mimeType: "image/png", data: imageUrl } },
    ];

    const result = await model.generateContent(input);
    const summary = result.response.text();

    note.summary = summary;
    await note.save();

    res.json({ message: "Summary generated successfully", summary });
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: "Failed to generate summary" });
  }
});

export default router;
