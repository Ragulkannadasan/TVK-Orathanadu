import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email }).select("-password").lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(JSON.parse(JSON.stringify(user)));
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { email, name, mobile, panchayat, boothNumber, voterId } = await req.json();
    if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOneAndUpdate(
      { email },
      { name, mobile, panchayat, boothNumber, voterId, isProfileComplete: !!(name && mobile && panchayat) },
      { new: true }
    ).select("-password").lean();

    return NextResponse.json({ success: true, user: JSON.parse(JSON.stringify(user)) });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
