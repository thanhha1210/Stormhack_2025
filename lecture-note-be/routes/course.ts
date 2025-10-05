// routes/course.ts
import express from "express";
import axios from "axios";
import { Course } from "../models/course";
import { verifyUser } from "../middleware/authMiddleware";
import { connectDB } from "../lib/dbConnect";
import { LectureNote } from "../models/note";

const router = express.Router();

// --- Helper Functions ---
function getCurrentTermAndYear() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  let term = "spring";
  if (month >= 5 && month <= 8) term = "summer";
  else if (month >= 9) term = "fall";
  return { term, year };
}

// --- Course Routes ---

// GET /api/courses - Get all courses (now global)
router.get("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const courses = await Course.find({}).sort({ createdAt: -1 });
  res.json(courses);
});

// POST /api/courses - Find or create a global course
router.post("/", verifyUser, async (req: any, res) => {
  await connectDB();
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Missing course code" });

  const upperCode = code.trim().toUpperCase();

  try {
    // 1. Check if the course already exists
    const existingCourse = await Course.findOne({ code: upperCode });
    if (existingCourse) {
      return res.json(existingCourse);
    }

    // 2. If not, fetch from SFU API and create it
    const [dept, num] = upperCode.split(/\s+/);
    if (!dept || !num) {
      return res.status(400).json({ error: "Invalid course code format. Use format like 'CMPT 225'." });
    }

    const { term, year } = getCurrentTermAndYear();
    const url = `https://www.sfu.ca/bin/wcm/course-outlines?${year}/${term}/${dept.toLowerCase()}/${num}`;
    const { data: sections } = await axios.get<any[]>(url);

    if (!sections || sections.length === 0) {
      return res.status(404).json({ error: `Course ${upperCode} not found for the ${term} ${year} term.` });
    }

    const courseTitle = sections[0].title;

    const newCourse = await Course.create({
      code: upperCode,
      title: courseTitle,
      term: `${term} ${year}`,
    });

    res.status(201).json(newCourse);
  } catch (err: any) {
    if (err.response && err.response.status === 404) {
      return res.status(404).json({ error: `Course ${upperCode} not found in the SFU database for the current term.` });
    }
    console.error("Add course process failed:", err.message);
    res.status(500).json({ error: "Failed to add course. Please check the course code and try again." });
  }
});

// GET /api/courses/:id - Get a single course by ID (now global)
router.get("/:id", verifyUser, async (req: any, res) => {
  await connectDB();
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ error: "Course not found" });
    res.json(course);
  } catch (err) {
    console.error("Error fetching course:", err);
    res.status(500).json({ error: "Failed to fetch course" });
  }
});

// GET /api/courses/:courseId/notes - Get all notes for a course (already shared)
router.get("/:courseId/notes", verifyUser, async (req: any, res) => {
  await connectDB();
  try {
    console.log(`[DEBUG] Fetching notes for course ID: ${req.params.courseId}`);
    const notes = await LectureNote.find({
      course: req.params.courseId,
    });
    console.log(`[DEBUG] Found ${notes.length} notes.`);
    res.json(notes);
  } catch (err) {
    console.error("Error fetching notes for course:", err);
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

export default router;