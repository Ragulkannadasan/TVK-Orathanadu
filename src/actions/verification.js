"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import Attendance from "@/models/Attendance";
import { auth } from "@/auth";

export async function verifyUserAction(userId) {
  try {
    const session = await auth();
    // ONLY Admin can verify and record attendance
    if (!session || session.user.role !== 'Admin') {
      throw new Error("Unauthorized: Only Admins can record attendance");
    }

    await dbConnect();
    
    if (!userId || userId.length !== 24) {
      throw new Error("Invalid ID format");
    }

    const user = await User.findById(userId).lean();

    if (!user) {
      throw new Error("User not found");
    }

    // Record Attendance
    await Attendance.create({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      panchayat: user.panchayat,
      boothNumber: user.boothNumber,
      event: "Constituency Meeting", // Default event
      scannedBy: session.user.id
    });

    return {
      success: true,
      user: {
        id: user._id.toString(),
        name: user.name,
        role: user.role,
        boothNumber: user.boothNumber,
        panchayat: user.panchayat,
        image: user.image,
        isProfileComplete: user.isProfileComplete
      }
    };
  } catch (error) {
    console.error("Verification Error:", error);
    return { error: error.message };
  }
}
