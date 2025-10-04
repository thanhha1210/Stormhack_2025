import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AuthUser {
  _id: string;
  email: string;
  role?: string;
}

export async function verifyUser(req: NextRequest): Promise<AuthUser | null> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer "))
      return null;

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY!) as AuthUser;
    return decoded;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return null;
  }
}

// Helper to reject unauthorized users
export function requireAuth(user: AuthUser | null) {
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
