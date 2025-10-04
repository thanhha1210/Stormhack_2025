// models/userModel.ts
import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Joi from "joi";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role?: "student" | "admin";
  generateAuthToken(): string;
  comparePassword(candidate: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      minlength: 5,
      maxlength: 255,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024, // hashed password
    },
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// JWT generator
userSchema.methods.generateAuthToken = function (): string {
  return jwt.sign(
    { _id: this._id, email: this.email, role: this.role },
    process.env.JWT_PRIVATE_KEY!,
    { expiresIn: "1d" }
  );
};

// Compare password
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

// Joi validation
export function validateUser(user: Partial<IUser>) {
  const schema = Joi.object({
    email: Joi.string().email().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
    name: Joi.string().min(3).max(50).required(),
  });
  return schema.validate(user);
}

export const User =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);
