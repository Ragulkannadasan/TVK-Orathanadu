import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import User from "@/models/User";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("email");
    if (!userEmail) return NextResponse.json({ error: "Email required" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ email: userEmail });
    if (!user) return NextResponse.json([]);

    const grievances = await Grievance.find({ userId: user._id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(JSON.parse(JSON.stringify(grievances)));
  } catch (error) {
    console.error("Grievances GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { email, title, description, category } = await req.json();
    if (!email || !title || !description || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    await dbConnect();
    let user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const grievance = await Grievance.create({
      userId: user._id,
      title,
      description,
      category,
      panchayat: user.panchayat || "Unknown",
      boothNumber: user.boothNumber || "Unknown",
      status: "Pending",
    });

    return NextResponse.json({ success: true, grievance });
  } catch (error) {
    console.error("Grievances POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
