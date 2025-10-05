import express from "express";
import jwt from "jsonwebtoken";
import { User, validateUser } from "../models/user";
import { connectDB } from "../lib/dbConnect";
import { verifyUser } from "../middleware/authMiddleware";

const router = express.Router();

// Register new user
router.post("/", async (req, res) => {
  await connectDB();
  const { name, email, password } = req.body;

  const { error } = validateUser(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ error: "User already exists" });

    // ⚡ No need to hash here — the model does it
    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_PRIVATE_KEY!, {
      expiresIn: "1d",
    });

    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Failed to register user" });
  }
});

// Get current logged-in user
router.get("/me", verifyUser, async (req: any, res) => {
  await connectDB();
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user info:", err);
    res.status(500).json({ error: "Failed to fetch user info" });
  }
});

export default router;
