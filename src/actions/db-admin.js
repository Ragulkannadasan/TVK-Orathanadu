"use server";

import dbConnect from "@/lib/db";
import Chat from "@/models/Message";
import Grievance from "@/models/Grievance";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

export async function getDatabaseStats() {
  try {
    await checkAdmin();
    await dbConnect();

    const [
      msgCount,
      grievanceCount, 
      userCount,
      resolvedCount
    ] = await Promise.all([
      Chat.countDocuments(),
      Grievance.countDocuments(),
      User.countDocuments(),
      Grievance.countDocuments({ status: "Resolved" })
    ]);

    // Detailed estimates
    const msgSize = (msgCount * 0.0002); // 200 bytes per msg
    const userSize = (userCount * 0.001); // 1kb per user
    const grievanceSize = (grievanceCount * 0.002); // 2kb per grievance
    
    const totalSize = msgSize + userSize + grievanceSize;

    return {
      totalSize: totalSize.toFixed(2),
      limitMB: 512,
      breakdown: [
        { label: "Messages", size: msgSize.toFixed(2), count: msgCount, percent: ((msgSize / totalSize) * 100 || 0).toFixed(1) },
        { label: "Grievances", size: grievanceSize.toFixed(2), count: grievanceCount, percent: ((grievanceSize / totalSize) * 100 || 0).toFixed(1) },
        { label: "Users", size: userSize.toFixed(2), count: userCount, percent: ((userSize / totalSize) * 100 || 0).toFixed(1) },
      ],
      resolvedCount
    };
  } catch (error) {
    console.error("Stats Error:", error);
    return null;
  }
}

export async function clearOldMessages(days = 30) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const result = await Chat.deleteMany({ createdAt: { $lt: cutoff } });
    
    revalidatePath("/dashboard/admin");
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    return { error: error.message };
  }
}

export async function clearResolvedGrievances() {
  try {
    await checkAdmin();
    await dbConnect();
    
    const result = await Grievance.deleteMany({ status: "Resolved" });
    
    revalidatePath("/dashboard/admin");
    return { success: true, deletedCount: result.deletedCount };
  } catch (error) {
    return { error: error.message };
  }
}
