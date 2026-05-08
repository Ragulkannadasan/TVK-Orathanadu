"use server";
import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import { revalidatePath } from "next/cache";

export async function submitGrievance(prevState, formData) {
  const userId = formData.get("userId");
  const title = formData.get("title");
  const description = formData.get("description");
  const category = formData.get("category");
  const panchayat = formData.get("panchayat");
  const boothNumber = formData.get("boothNumber");

  if (!title || !description || !category) {
    return { error: "Please fill in all required fields" };
  }

  await dbConnect();

  try {
    const newGrievance = new Grievance({
      userId,
      title,
      description,
      category,
      panchayat,
      boothNumber,
      status: "Pending",
    });

    await newGrievance.save();
    revalidatePath("/dashboard/grievances");
    return { success: "Grievance submitted successfully! Our team will review it shortly." };
  } catch (error) {
    return { error: "Failed to submit grievance. Please try again." };
  }
}
