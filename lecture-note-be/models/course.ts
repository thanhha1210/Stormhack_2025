import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  code: string;
  title: string;
  term: string;
}

const courseSchema = new Schema<ICourse>(
  {
    code: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    term: { type: String, required: true },
  },
  { timestamps: true }
);

export const Course =
  mongoose.models.Course || mongoose.model<ICourse>("Course", courseSchema);