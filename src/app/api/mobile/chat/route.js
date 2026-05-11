import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Message from "@/models/Message";

export async function GET() {
  try {
    await dbConnect();
    const messages = await Message.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(messages.reverse());
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    const { content, senderEmail, senderName, role } = await req.json();
    
    const newMessage = await Message.create({
      content,
      senderEmail,
      senderName,
      role,
      createdAt: new Date()
    });

    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
