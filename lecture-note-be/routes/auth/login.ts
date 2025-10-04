import { NextResponse } from "next/server";
import { connectDB } from "../../lib/dbConnect";
import { User } from "../../models/user";

export async function POST(req: Request) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email });
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const valid = await user.comparePassword(password);
  if (!valid) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

  const token = user.generateAuthToken();
  return NextResponse.json({ token, user: { id: user._id, email, name: user.name } });
}
