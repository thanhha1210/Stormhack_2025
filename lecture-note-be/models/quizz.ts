import mongoose, { Schema, Document, Types } from "mongoose";

export interface IQuiz extends Document {
  user: Types.ObjectId;
  note: Types.ObjectId;
  question: string;
  options?: string[];
  answer: string;
  type: "mcq" | "short" | "code";
  correctCount: number;
  wrongCount: number;
}

const quizSchema = new Schema<IQuiz>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: Schema.Types.ObjectId, ref: "LectureNote", required: true },
    question: { type: String, required: true },
    options: [String],
    answer: { type: String, required: true },
    type: { type: String, enum: ["mcq", "short", "code"], default: "mcq" },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Quiz =
  mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", quizSchema);
