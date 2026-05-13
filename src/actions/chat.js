"use server";

import dbConnect from "@/lib/db";
import Chat from "@/models/Message";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMessages(limit = 50) {
  try {
    const session = await auth();
    if (!session?.user?.tvkToken) return { error: "Unauthorized" };

    const response = await fetch(`https://tvk-api-server.onrender.com/api/chat?limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${session.user.tvkToken}`
      }
    });

    const messages = await response.json();
    if (!response.ok) throw new Error(messages.error || "Failed to fetch");

    return messages;
  } catch (error) {
    console.error("Chat fetch error:", error);
    return { error: error.message };
  }
}

export async function sendMessage(content, attachment = null) {
  try {
    const session = await auth();
    if (!session?.user?.tvkToken) return { error: "Authentication required" };

    if (!content && !attachment) return { error: "Message cannot be empty" };

    const response = await fetch('https://tvk-api-server.onrender.com/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.user.tvkToken}`
      },
      body: JSON.stringify({
        content: content?.trim(),
        senderEmail: session.user.email,
        senderName: session.user.name || "Anonymous",
        role: session.user.role || 'Voter',
        attachment
      }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Failed to send");

    revalidatePath("/chat");
    return { success: true, message: data };
  } catch (error) {
    console.error("SEND ERROR:", error);
    return { error: error.message };
  }
}
