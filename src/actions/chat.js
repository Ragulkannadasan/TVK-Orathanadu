"use server";

import dbConnect from "@/lib/db";
import Message from "@/models/Message";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getMessages(limit = 50) {
  try {
    console.log("getMessages called - Server Action");
    await dbConnect();
    const messages = await Message.find()
      .populate("userId", "name username image role email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return JSON.parse(JSON.stringify(messages.reverse()));
  } catch (error) {
    console.error("Get Messages Error:", error);
    return [];
  }
}

async function ensureUserInDb(sessionUser) {
  await dbConnect();
  let user = await User.findOne({ email: sessionUser.email });
  
  if (!user) {
    // If user exists in session but not in DB, they might be a local user
    // Create a shadow record in DB so they can perform DB-linked actions
    user = new User({
      name: sessionUser.name || "User",
      email: sessionUser.email,
      role: sessionUser.role || "Voter",
      password: "local_auth_only", // This user logs in via local JSON, not DB
      isProfileComplete: true,
    });
    await user.save();
  }
  return user;
}

export async function sendMessage(text) {
  try {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");

    const user = await ensureUserInDb(session.user);

    if (!text || text.trim().length === 0) return { error: "Message cannot be empty" };

    const newMessage = new Message({
      userId: user._id,
      text: text.trim(),
    });

    await newMessage.save();
    
    // Emit event for real-time SSE stream
    const { chatEmitter } = await import("@/lib/chat-bus");
    chatEmitter.emit("newMessage", newMessage);

    revalidatePath("/dashboard/chat");
    return { success: true };
  } catch (error) {
    console.error("Send Message Error:", error);
    return { error: error.message };
  }
}
