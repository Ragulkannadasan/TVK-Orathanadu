"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    throw new Error("Unauthorized: Admin access required");
  }
}

export async function deleteUser(userId) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const targetUser = await User.findById(userId);
    if (targetUser?.email === "admin@tvk.com") {
      return { error: "The primary Admin account cannot be deleted" };
    }

    // Don't allow deleting self
    const session = await auth();
    if (session.user.id === userId) {
      return { error: "You cannot delete your own account" };
    }

    await User.findByIdAndDelete(userId);
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Delete User Error:", error);
    return { error: error.message };
  }
}

export async function updateUserRole(userId, newRole) {
  try {
    await checkAdmin();
    await dbConnect();

    const targetUser = await User.findById(userId);
    if (targetUser?.email === "admin@tvk.com") {
      return { error: "The primary Admin's role cannot be changed" };
    }

    const allowedRoles = ['Voter', 'Poruppalar', 'Admin', 'MLA', 'DistSecretary'];
    if (!allowedRoles.includes(newRole)) {
      return { error: "Invalid role" };
    }

    await User.findByIdAndUpdate(userId, { role: newRole });
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    console.error("Update Role Error:", error);
    return { error: error.message };
  }
}

export async function updateGrievanceStatus(grievanceId, status) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const GrievanceModule = await import("@/models/Grievance");
    const Grievance = GrievanceModule.default || GrievanceModule;

    const allowedStatuses = ['Pending', 'Investigating', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      return { error: "Invalid status" };
    }

    await Grievance.findByIdAndUpdate(grievanceId, { 
      status,
      updatedAt: Date.now() 
    });
    
    revalidatePath("/dashboard/admin/grievances");
    revalidatePath("/dashboard/admin"); // Update analytics
    return { success: true };
  } catch (error) {
    console.error("Update Grievance Status Error:", error);
    return { error: error.message };
  }
}

export async function deleteGrievance(grievanceId) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const GrievanceModule = await import("@/models/Grievance");
    const Grievance = GrievanceModule.default || GrievanceModule;

    await Grievance.findByIdAndDelete(grievanceId);
    
    revalidatePath("/dashboard/admin/grievances");
    revalidatePath("/dashboard/admin"); // Update analytics
    return { success: true };
  } catch (error) {
    console.error("Delete Grievance Error:", error);
    return { error: error.message };
  }
}
export async function bulkDeleteUsers(userIds) {
  try {
    await checkAdmin();
    await dbConnect();
    
    // Safety check: Cannot delete admins or self
    const session = await auth();
    const targetUsers = await User.find({ _id: { $in: userIds } });
    const safeIds = targetUsers
      .filter(u => u.email !== "admin@tvk.com" && u._id.toString() !== session.user.id)
      .map(u => u._id);

    await User.deleteMany({ _id: { $in: safeIds } });
    revalidatePath("/dashboard/admin/users");
    return { success: true, count: safeIds.length };
  } catch (error) {
    return { error: error.message };
  }
}

export async function bulkUpdateRoles(userIds, newRole) {
  try {
    await checkAdmin();
    await dbConnect();
    
    const allowedRoles = ['Voter', 'Poruppalar', 'Admin', 'MLA', 'DistSecretary'];
    if (!allowedRoles.includes(newRole)) throw new Error("Invalid role");

    await User.updateMany(
      { _id: { $in: userIds }, email: { $ne: "admin@tvk.com" } },
      { role: newRole }
    );
    
    revalidatePath("/dashboard/admin/users");
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}
