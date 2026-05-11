import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import OTP from "@/models/OTP";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    await dbConnect();

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to DB
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send Email
    const result = await sendEmail({
      to: email,
      subject: `Your TVK Access Code: ${otp}`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #800000; text-align: center;">TVK Orathanadu</h2>
          <p>Hello,</p>
          <p>Your one-time password (OTP) for accessing the mobile app is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #800000; border-radius: 10px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (!result.success) {
      console.error("Email send failed:", result.error);
      return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
