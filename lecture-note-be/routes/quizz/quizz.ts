import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { Quiz } from "../../models/quizz";
import { LectureNote } from "../../models/note";
import { verifyUser, requireAuth } from "../../middleware/authMiddleware";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const { noteId, question, options, answer, type } = await req.json();

  // Ensure the note belongs to the same user
  const note = await LectureNote.findById(noteId);
  if (!note || note.user.toString() !== user!._id)
    return NextResponse.json({ error: "Unauthorized note access" }, { status: 403 });

  const quiz = await Quiz.create({
    user: user!._id,
    note: new mongoose.Types.ObjectId(noteId),
    question,
    options,
    answer,
    type,
  });

  note.quizRefs.push(quiz._id);
  await note.save();

  return NextResponse.json({ id: quiz._id });
}

// GET /api/quizzes?noteId=<id>
export async function GET(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const noteId = new URL(req.url).searchParams.get("noteId");
  if (!noteId) return NextResponse.json({ error: "Missing noteId" }, { status: 400 });

  const quizzes = await Quiz.find({ user: user!._id, note: noteId });
  return NextResponse.json(quizzes);
}
