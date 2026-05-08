"use server";
import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import User from "@/models/User";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function ensureUserInDb(sessionUser) {
  await dbConnect();
  let user = await User.findOne({ email: sessionUser.email });
  
  if (!user) {
    user = new User({
      name: sessionUser.name || "User",
      email: sessionUser.email,
      role: sessionUser.role || "Voter",
      password: "local_auth_only",
      isProfileComplete: true,
    });
    await user.save();
  }
  return user;
}

export async function submitGrievance(prevState, formData) {
  try {
    const session = await auth();
    if (!session?.user) {
      return { error: "You must be logged in to submit a grievance" };
    }

    const user = await ensureUserInDb(session.user);

    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");
    const panchayat = user.panchayat || "Unknown";
    const boothNumber = user.boothNumber || "Unknown";

    if (!title || !description || !category) {
      return { error: "Please fill in all required fields" };
    }

    const newGrievance = new Grievance({
      userId: user._id,
      title,
      description,
      category,
      panchayat,
      boothNumber,
      status: "Pending",
    });

    await newGrievance.save();
    revalidatePath("/dashboard/grievances");
    revalidatePath("/dashboard/admin"); // Update analytics
    return { success: "Grievance submitted successfully! Our team will review it shortly." };
  } catch (error) {
    console.error("Grievance Submission Error:", error);
    return { error: "Failed to submit grievance. Please try again." };
  }
}
