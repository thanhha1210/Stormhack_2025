import mongoose, { Schema, Document, Types } from "mongoose";

export interface IFlashcard extends Document {
  user: Types.ObjectId;
  note: Types.ObjectId;
  term: string;
  definition: string;
  correctCount: number;
  wrongCount: number;
}

const flashcardSchema = new Schema<IFlashcard>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note: { type: Schema.Types.ObjectId, ref: "LectureNote", required: true },
    term: { type: String, required: true },
    definition: { type: String, required: true },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Flashcard =
  mongoose.models.Flashcard || mongoose.model<IFlashcard>("Flashcard", flashcardSchema);
