import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { verifyUser, requireAuth } from "../../middleware/authMiddleware";
import { LectureNote } from "../../models/note";
import { Flashcard } from "../../models/flashcard";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const { noteId, pdfUrl, imageUrl } = await req.json();

  if (!noteId || (!pdfUrl && !imageUrl))
    return NextResponse.json({ error: "Missing noteId or file" }, { status: 400 });

  // Verify note ownership
  const note = await LectureNote.findById(noteId);
  if (!note || note.user.toString() !== user!._id)
    return NextResponse.json({ error: "Unauthorized note access" }, { status: 403 });

  // Initialize Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // 🧠 Prompt for extracting terms and definitions
  const prompt = `
You are a study assistant that extracts key terms and definitions for flashcards.

From the provided lecture note, identify important concepts, technical terms, 
and definitions. Focus on concise, clear explanations.

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

  try {
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const flashcards = JSON.parse(jsonStr);

    const savedCards = [];
    for (const c of flashcards) {
      const card = await Flashcard.create({
        user: user!._id,
        note: new mongoose.Types.ObjectId(noteId),
        term: c.term,
        definition: c.definition,
      });
      savedCards.push(card);
    }

    return NextResponse.json({
      message: "Flashcards generated successfully",
      count: savedCards.length,
      flashcards: savedCards,
    });
  } catch (error) {
    console.error("Gemini flashcard generation error:", error);
    return NextResponse.json({ error: "Failed to generate flashcards" }, { status: 500 });
  }
}
