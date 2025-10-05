import express from "express";
import { Course } from "../models/course";
import { verifyUser } from "../middleware/authMiddleware";
import { connectDB } from "../lib/dbConnect";

const router = express.Router();

// 🪐 Get all user courses
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
});

// 🚀 Add new course
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { title, description } = req.body;
  const course = await Course.create({
    title,
    description,
    user: req.user._id,
  });
  res.status(201).json(course);
});

export default router;
