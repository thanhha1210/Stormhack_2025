import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string;
if (!MONGO_URI) throw new Error("Missing MONGO_URI env variable");

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;
  const conn = await mongoose.connect(MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected:", conn.connection.host);
}
