import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role") || "Voter";

    await dbConnect();
    const notifications = await Notification.find({
      $or: [{ targetRole: "All" }, { targetRole: role }]
    }).sort({ createdAt: -1 }).limit(50).lean();

    return NextResponse.json(JSON.parse(JSON.stringify(notifications)));
  } catch (error) {
    console.error("Notifications GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
