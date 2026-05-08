"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import OTP from "@/models/OTP";
import { sendEmail } from "@/lib/mailer";
import bcrypt from "bcryptjs";
import { signIn } from "@/auth";

export async function signUpAction(prevState, formData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  await dbConnect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return { error: "Email already registered" };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "Voter", // Default role
  });

  try {
    await newUser.save();
    return { success: "User registered successfully! You can now log in." };
  } catch (err) {
    return { error: "Something went wrong during registration" };
  }
}

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid credentials" };
    }
    throw error;
  }
}

export async function sendOTPAction(prevState, formData) {
  const email = formData.get("email");
  if (!email) return { error: "Email is required" };

  await dbConnect();

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // Save OTP to DB (replaces existing if any)
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
          <p>Your one-time password (OTP) for accessing the portal is:</p>
          <div style="background: #f4f4f4; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #800000; border-radius: 10px; margin: 20px 0;">
            ${otp}
          </div>
          <p style="font-size: 12px; color: #666; text-align: center;">This code expires in 5 minutes.</p>
        </div>
      `,
    });

    if (!result.success) throw new Error("Failed to send email");

    return { success: "OTP sent to your email!", email };
  } catch (error) {
    console.error("OTP Error:", error);
    return { error: "Failed to send OTP. Please try again." };
  }
}
