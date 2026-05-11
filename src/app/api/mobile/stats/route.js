import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Grievance from "@/models/Grievance";

export async function GET() {
  try {
    await dbConnect();
    
    const [
      totalUsers, 
      totalGrievances, 
      pendingGrievances,
      completeProfiles
    ] = await Promise.all([
      User.countDocuments(),
      Grievance.countDocuments(),
      Grievance.countDocuments({ status: { $in: ["Pending", "Investigating"] } }),
      User.countDocuments({ isProfileComplete: true })
    ]);

    const roleData = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } }
    ]);

    return NextResponse.json({
      totalUsers,
      totalGrievances,
      pendingGrievances,
      completionRate: totalUsers > 0 ? Math.round((completeProfiles / totalUsers) * 100) : 0,
      roleDistribution: roleData.map(r => ({ label: r._id, count: r.count }))
    });
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
