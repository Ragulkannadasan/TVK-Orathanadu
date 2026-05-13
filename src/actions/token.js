"use server";

import { auth } from "@/auth";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tvk_super_secret_key_2026';

export async function getClientToken() {
  try {
    const session = await auth();
    if (!session?.user) return null;

    return jwt.sign(
      { _id: session.user.id, email: session.user.email, role: session.user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
  } catch (error) {
    console.error("Token generation error:", error);
    return null;
  }
}
