import express from "express";
import { connectDB } from "../lib/dbConnect";
import { User } from "../models/user";

const router = express.Router();

// ✅ Login
router.post("/login", async (req, res) => {
  await connectDB();
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(400).json({ error: "Invalid email" });
    }

    const valid = await user.comparePassword(password);
    console.log("Typed password:", password);
    console.log("Compare result:", await user.comparePassword(password));

    if (!valid) {
      console.log("Invalid password for:", email);
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = user.generateAuthToken();
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (err: any) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

export default router;
