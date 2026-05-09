"use server";

import dbConnect from "@/lib/db";
import Chat from "@/models/Message";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMessages(limit = 50) {
  try {
    const session = await auth();
    if (!session) return { error: "Unauthorized" };

    await dbConnect();
    const messages = await Chat.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Reverse to get chronological order for the UI
    return JSON.parse(JSON.stringify(messages.reverse()));
  } catch (error) {
    console.error("Chat fetch error:", error);
    return { error: "Failed to fetch messages" };
  }
}

export async function sendMessage(content) {
  try {
    const session = await auth();
    if (!session?.user) return { error: "Authentication required" };

    if (!content || content.trim().length === 0) return { error: "Message cannot be empty" };

    await dbConnect();
    
    const messageData = {
      senderEmail: session.user.email,
      senderName: session.user.name || "Anonymous",
      content: content.trim(),
      role: session.user.role || 'Voter',
    };

    console.log("Attempting to save message:", { ...messageData, content: "[HIDDEN]" });

    const newMessage = await Chat.create(messageData);

    revalidatePath("/chat");
    return { success: true, message: JSON.parse(JSON.stringify(newMessage)) };
  } catch (error) {
    console.error("CRITICAL SEND ERROR:", error);
    return { error: error.message || "Failed to send message. Please check your connection." };
  }
}
