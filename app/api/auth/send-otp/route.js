import dbConnect from '@/lib/mongodb';
import Otp from '@/models/Otp';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    await dbConnect();

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Set expiration to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Update or create the OTP for this email
    const normalizedEmail = email.toLowerCase().trim();
    await Otp.findOneAndUpdate(
      { email: normalizedEmail },
      { otp, expiresAt },
      { upsert: true, returnDocument: 'after' }
    );

    // Always log OTP in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n\n🔑 DEVELOPMENT OTP FOR ${email}: ${otp}\n\n`);
    }

    // Configure Nodemailer Transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: `"TVK Orathanadu" <${process.env.GMAIL_EMAIL}>`,
      to: email,
      subject: 'TVK Orathanadu – Your Login OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
          <div style="background: #800000; padding: 24px; text-align: center;">
            <h1 style="color: #FFD700; margin: 0; font-size: 24px;">தமிழக வெற்றி கழகம்</h1>
            <p style="color: #fff; margin: 4px 0 0;">Your OTP for Login</p>
          </div>
          <div style="padding: 32px; text-align: center;">
            <p style="font-size: 16px; color: #333;">Enter the following OTP to log in to your account:</p>
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; color: #800000; margin: 24px 0;">${otp}</div>
            <p style="color: #999; font-size: 12px;">This OTP is valid for 10 minutes. Do not share this code with anyone.</p>
          </div>
        </div>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending OTP:', error);
    
    // In development, if email fails (e.g. no credentials), we still succeed because we logged it
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ success: true, devMode: true });
    }
    
    return NextResponse.json({ error: error.message || 'Failed to send OTP' }, { status: 500 });
  }
}
