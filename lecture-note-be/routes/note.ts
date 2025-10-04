import { NextResponse, NextRequest } from "next/server";
import { connectDB } from "../lib/dbConnect";
import { LectureNote } from "../models/note";
import { verifyUser, requireAuth } from "../middleware/authMiddleware";

// POST /api/notes → upload new note
export async function POST(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const { courseId, title, pdfUrl } = await req.json();
  const note = await LectureNote.create({
    user: user!._id,
    courseId,
    title,
    pdfUrl,
  });

  return NextResponse.json({ id: note._id });
}

// GET /api/notes → fetch all notes of logged-in user
export async function GET(req: NextRequest) {
  await connectDB();
  const user = await verifyUser(req);
  const unauthorized = requireAuth(user);
  if (unauthorized) return unauthorized;

  const notes = await LectureNote.find({ user: user!._id }).populate("quizRefs");
  return NextResponse.json(notes);
}
