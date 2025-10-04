import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILectureNote extends Document {
  user: Types.ObjectId;
  title: string;
  pdfUrl?: string;
  imageUrl?: string;
  course?: string;
  summary?: string;
  quizRefs?: Types.ObjectId[];
}

const noteSchema = new Schema<ILectureNote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    pdfUrl: String,
    imageUrl: String,
    course: String,
    summary: String,
    quizRefs: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
  },
  { timestamps: true }
);

export const LectureNote =
  mongoose.models.LectureNote ||
  mongoose.model<ILectureNote>("LectureNote", noteSchema);
