import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { LectureNote } from "../../models/note";
import { Quiz } from "../../models/quiz";
import { verifyUser, requireAuth } from "../../middleware/authMiddleware";
import { GoogleGenerativeAI } from "google/generative-ai";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const { noteId, pdfUrl, imageUrl } = await req.json();

  // ✅ Validate input
  if (!noteId || (!pdfUrl && !imageUrl))
    return NextResponse.json({ error: "Missing file or noteId" }, { status: 400 });

  // ✅ Ensure the note belongs to this user
  const note = await LectureNote.findById(noteId);
  if (!note || note.user.toString() !== user!._id)
    return NextResponse.json({ error: "Unauthorized note access" }, { status: 403 });

  // ✅ Setup Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // ✅ Build prompt
  const prompt = `
  You are an intelligent quiz generator.
  Based on the following lecture note, generate 1 quiz questions.
  Output as valid JSON with this structure:
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

  try {
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // Try to extract JSON block from AI response
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const quizzes = JSON.parse(jsonStr);

    // ✅ Save each quiz
    const savedQuizzes = [];
    for (const q of quizzes) {
      const quiz = await Quiz.create({
        user: user!._id,
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

    return NextResponse.json({
      message: "Quizzes generated successfully",
      count: savedQuizzes.length,
      quizzes: savedQuizzes,
    });
  } catch (err) {
    console.error("Gemini quiz generation error:", err);
    return NextResponse.json({ error: "Failed to generate quizzes" }, { status: 500 });
  }
}
