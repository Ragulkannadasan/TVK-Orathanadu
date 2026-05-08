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
