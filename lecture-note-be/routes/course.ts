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

import { LectureNote } from "../models/note";

// 🪐 Get all user courses
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const courses = await Course.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(courses);
});

// 📚 Get all notes for a specific course
router.get("/:courseId/notes", verifyUser, async (req: any, res) => {
  await connectDB();
  try {
    const notes = await LectureNote.find({
      user: req.user._id,
      course: req.params.courseId,
    });
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes for course:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

// 🛰️ Get a single course by ID
router.get("/:id", verifyUser, async (req: any, res) => {
  await connectDB();
  try {
    const course = await Course.findOne({ _id: req.params.id, user: req.user._id });
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// 🚀 Add course by code (auto-fetch SFU title)
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing course code" });

  try {
    const [dept, num] = code.trim().toUpperCase().split(/\s+/);
    if (!dept || !num) {
      return res.status(400).json({ error: "Invalid course code format. Use format like 'CMPT 225'." });
    }

    const { term, year } = getCurrentTermAndYear();
    const url = `https://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${dept.toLowerCase()}/${num}`;

    // Fetch the list of sections for the course
    const { data: sections } = await axios.get<any[]>(url);

    // Check if any sections were returned
    if (!sections || sections.length === 0) {
      return res.status(404).json({ error: `Course ${code} not found for the ${term} ${year} term.` });
    }

    // Take the title from the first section
    const courseTitle = sections[0].title;

    const course = await Course.create({
      user: req.user._id,
      code,
      title: courseTitle,
      term: `${term} ${year}`,
    });

    res.status(201).json(course);
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
        return res.status(404).json({ error: `Course ${code} not found in the SFU database for the current term.` });
    }
    console.error("Add course process failed:", err.message);
    res.status(500).json({ error: "Failed to add course. Please check the course code and try again." });
  }
});

export default router;
