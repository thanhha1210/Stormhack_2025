import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILectureNote extends Document {
  user: Types.ObjectId;
  courseId: string;
  title: string;
  pdfUrl: string;      // Firebase Storage or S3 URL
  summary?: string;    // Gemini AI summary
  quizRefs: Types.ObjectId[];
  uploadedAt: Date;
}

const noteSchema = new Schema<ILectureNote>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    courseId: { type: String, required: true },
    title: { type: String, required: true },
    pdfUrl: { type: String, required: true },
    summary: { type: String },
    quizRefs: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    uploadedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const LectureNote =
  mongoose.models.LectureNote ||
  mongoose.model<ILectureNote>("LectureNote", noteSchema);
