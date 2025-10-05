import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  code: { type: String, required: true },
  title: { type: String, required: true },
  term: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Course = mongoose.model("Course", courseSchema);
