import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { verifyUser, requireAuth } from "../../middleware/authMiddleware";
import { LectureNote } from "../../models/note";
import { Quiz } from "../../models/quiz";
import { Test } from "../../models/test";
import mongoose from "mongoose";
import { GoogleGenerativeAI } from "google/generative-ai";

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const { noteId, pdfUrl, numMcq = 5, numShort = 2, numCode = 1 } = await req.json();

  if (!noteId || !pdfUrl)
    return NextResponse.json({ error: "Missing noteId or pdfUrl" }, { status: 400 });

  // Ensure the note belongs to the same user
  const note = await LectureNote.findById(noteId);
  if (!note || note.user.toString() !== user!._id)
    return NextResponse.json({ error: "Unauthorized note access" }, { status: 403 });

  // Initialize Gemini client
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

  // 🧠 Prompt construction
  const prompt = `
You are an intelligent quiz/test generator.

Read the provided lecture note (PDF). 
Generate a total of ${numMcq + numShort + numCode} questions with this breakdown:
- ${numMcq} multiple-choice questions (MCQ)
- ${numShort} short-answer questions
- ${numCode} coding or logic questions

Format the output as *valid JSON* array, for example:
[
  {"question": "...", "options": ["A","B","C","D"], "answer": "B", "type": "mcq"},
  {"question": "...", "answer": "...", "type": "short"},
  {"question": "...", "answer": "...", "type": "code"}
]
Be concise, do not include explanation text outside the JSON.
`;

  const inputData = [
    prompt,
    { fileData: { mimeType: "application/pdf", fileUri: pdfUrl } },
  ];

  try {
    const result = await model.generateContent(inputData);
    const text = result.response.text();

    // Extract JSON safely
    const jsonStart = text.indexOf("[");
    const jsonEnd = text.lastIndexOf("]") + 1;
    const jsonStr = text.slice(jsonStart, jsonEnd);
    const quizzes = JSON.parse(jsonStr);

    // Save quizzes and collect refs
    const quizRefs: mongoose.Types.ObjectId[] = [];
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
      quizRefs.push(quiz._id);
    }
    await note.save();

    // Create Test document
    const test = await Test.create({
      user: user!._id,
      title: `${note.title} - Auto Test`,
      description: `Auto-generated from lecture note`,
      quizRefs,
      totalQuestions: quizRefs.length,
    });

    return NextResponse.json({
      message: "✅ Test generated successfully",
      testId: test._id,
      totalQuestions: quizRefs.length,
    });
  } catch (error) {
    console.error("Gemini test generation error:", error);
    return NextResponse.json({ error: "Failed to generate test" }, { status: 500 });
  }
}
