import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find()
      .populate("userId", "name username image role email")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    
    const serializedMessages = JSON.parse(JSON.stringify(messages.reverse()));
    return NextResponse.json(serializedMessages);
  } catch (error) {
    console.error("API Get Messages Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
