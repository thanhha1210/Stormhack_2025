import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITest extends Document {
  user: Types.ObjectId;
  title: string;
  description?: string;
  quizRefs: Types.ObjectId[];
  totalQuestions: number;
  correctAnswers: number;
  startedAt?: Date;
  completedAt?: Date;
}

const testSchema = new Schema<ITest>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    quizRefs: [{ type: Schema.Types.ObjectId, ref: "Quiz" }],
    totalQuestions: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    startedAt: Date,
    completedAt: Date,
  },
  { timestamps: true }
);

export const Test =
  mongoose.models.Test || mongoose.model<ITest>("Test", testSchema);
