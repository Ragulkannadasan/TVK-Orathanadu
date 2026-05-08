"use server";

import dbConnect from "@/lib/db";
import Notification from "@/models/Notification";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    const session = await auth();
    if (!session?.user) return [];

    await dbConnect();
    // Fetch notifications targeting 'All' or the user's specific role
    const notifications = await Notification.find({
      $or: [
        { targetRole: "All" },
        { targetRole: session.user.role }
      ]
    })
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error("Get Notifications Error:", error);
    return [];
  }
}

export async function createNotification(formData) {
  try {
    const session = await auth();
    if (session?.user?.role !== "Admin") throw new Error("Unauthorized");

    await dbConnect();
    const title = formData.get("title");
    const message = formData.get("message");
    const type = formData.get("type") || "info";
    const targetRole = formData.get("targetRole") || "All";

    const newNotification = new Notification({
      title,
      message,
      type,
      targetRole
    });

    await newNotification.save();
    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteNotification(id) {
  try {
    const session = await auth();
    if (session?.user?.role !== "Admin") throw new Error("Unauthorized");

    await dbConnect();
    await Notification.findByIdAndDelete(id);
    revalidatePath("/dashboard/notifications");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
