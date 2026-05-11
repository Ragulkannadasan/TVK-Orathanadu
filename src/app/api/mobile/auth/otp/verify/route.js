import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OTP from "@/models/OTP";
import User from "@/models/User";

export async function POST(req) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });

    await dbConnect();

    // Find and validate OTP
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 401 });
    }

    // Check expiration (5 minutes)
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (otpRecord.createdAt < fiveMinutesAgo) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return NextResponse.json({ error: "OTP has expired" }, { status: 401 });
    }

    // OTP valid, find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        role: "Voter",
        isProfileComplete: false,
        createdAt: new Date()
      });
    }

    // Delete OTP after use
    await OTP.deleteOne({ _id: otpRecord._id });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        isProfileComplete: user.isProfileComplete
      }
    });
  } catch (error) {
    console.error("Verify API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
