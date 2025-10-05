import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config({ path: "../.env.local" });
import { connectDB } from "./lib/dbConnect";

import authRouter from "./routes/auth";
import userRouter from "./routes/user";
import notesRouter from "./routes/note";
import summaryRouter from "./routes/summary";
import quizzesRouter from "./routes/quizz";
import quizGenerateRouter from "./routes/quizzGenerate";
import testRouter from "./routes/test";
import courseRouter from "./routes/course";
import flashcardsRouter from "./routes/flashcard";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
connectDB()
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err: Error) => console.error("❌ MongoDB connection failed:", err));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/notes", notesRouter);
app.use("/api/summary", summaryRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/quizzes/generate", quizGenerateRouter);
app.use("/api/tests", testRouter);
app.use("/api/flashcards", flashcardsRouter);
app.use("/api/courses", courseRouter);


// Root route
app.get("/", (_req: Request, res: Response) => {
  res.send("📚 Lecture Note API is running...");
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
