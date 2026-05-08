import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import User from "@/models/User"; // For population
import GrievanceList from "./grievance-list";

export const metadata = { title: "Manage Grievances – TVK Orathanadu" };

export default async function AdminGrievancesPage() {
  await dbConnect();
  
  const grievances = await Grievance.find({})
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  // Serialize IDs
  const serializedGrievances = JSON.parse(JSON.stringify(grievances));

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto pb-20">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-1 bg-[#FFD700] rounded-full" />
          <span className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em]">Central Registry</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white display-font mb-2">
          Constituency <span className="gradient-text">Grievances</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base max-w-2xl">
          Track and resolve public issues across Orathanadu. Manage status and monitor resolution progress.
        </p>
      </div>

      <GrievanceList initialGrievances={serializedGrievances} />
    </div>
  );
}
