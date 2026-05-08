"use server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(prevState, formData) {
  const userId = formData.get("userId");
  const mobile = formData.get("mobile");
  const voterId = formData.get("voterId");
  const panchayat = formData.get("panchayat");
  const boothNumber = formData.get("boothNumber");
  const image = formData.get("image");
  const username = formData.get("username")?.toLowerCase().replace(/[^a-z0-9_.]/g, "");

  if (!userId) return { error: "User ID missing" };

  await dbConnect();

  try {
    // Check if username is taken
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: userId } 
      });
      if (existingUser) {
        return { error: "Username is already taken" };
      }
    }

    await User.findByIdAndUpdate(userId, {
      username,
      mobile,
      voterId,
      panchayat,
      boothNumber,
      image,
      isProfileComplete: true,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: "Profile updated successfully!" };
  } catch (error) {
    return { error: "Failed to update profile" };
  }
}
