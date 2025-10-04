import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { User } from "../../models/user";

export async function POST(req: Request) {
  await connectDB();
  const { email, password, name } = await req.json();

  const existing = await User.findOne({ email });
  if (existing)
    return NextResponse.json({ error: "Email already exists" }, { status: 400 });

  const user = new User({ email, password, name });
  await user.save();

  const token = user.generateAuthToken();
  return NextResponse.json({ token, user: { id: user._id, email, name } });
}
