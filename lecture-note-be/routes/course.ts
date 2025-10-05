// routes/course.ts
import express from "express";
import axios from "axios";
import { Course } from "../models/course";
import { verifyUser } from "../middleware/authMiddleware";
import { connectDB } from "../lib/dbConnect";

const router = express.Router();

// helper to auto-detect term & year
function getCurrentTermAndYear() {
  const now = new Date();
  const month = now.getMonth() + 1; // Jan = 1
  const year = now.getFullYear();

  // SFU terms roughly align like this:
  // Spring = Jan–Apr, Summer = May–Aug, Fall = Sep–Dec
  let term = "spring";
  if (month >= 5 && month <= 8) term = "summer";
  else if (month >= 9) term = "fall";

  return { term, year };
}

// 🪐 Get all user courses
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
});

// 🚀 Add course by code (auto-fetch SFU title)
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing course code" });

  try {
    const [dept, num] = code.trim().split(/\s+/);
    const { term, year } = getCurrentTermAndYear(); // 💡 dynamic detection

    const url = `https://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${dept.toLowerCase()}/${num}`;
    interface SFUCourseResponse {
      info?: {
        title?: string;
        [key: string]: any;
      };
      [key: string]: any;
    }
    const { data } = await axios.get<SFUCourseResponse>(url);

    if (!data || !data.info?.title) {
      return res.status(404).json({ error: "Course not found in SFU API" });
    }

    const course = await Course.create({
      user: req.user._id,
      code,
      title: data.info.title,
      term: `${term} ${year}`,
    });

    res.status(201).json(course);
  } catch (err: any) {
    console.error("SFU API fetch failed:", err.message);
    res.status(500).json({ error: "Failed to fetch course data" });
  }
});

export default router;
