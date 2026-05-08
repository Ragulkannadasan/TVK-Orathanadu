import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Grievance from "@/models/Grievance";
import { Users, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";

export const metadata = { title: "Admin Analytics – TVK Orathanadu" };

export default async function AdminDashboard() {
  await dbConnect();
  
  const [totalUsers, totalGrievances, pendingGrievances, resolvedGrievances] = await Promise.all([
    User.countDocuments(),
    Grievance.countDocuments(),
    Grievance.countDocuments({ status: "Pending" }),
    Grievance.countDocuments({ status: "Resolved" }),
  ]);

  const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5).lean();

  return (
    <div className="p-4 md:p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white display-font mb-1">Admin <span className="gradient-text">Analytics</span></h1>
        <p className="text-white/60 text-sm md:text-base mt-2">Constituency 175 · Management Overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<Users className="text-blue-400" />} label="Total Users" value={totalUsers} sublabel="Registered members" />
        <StatCard icon={<FileText className="text-amber-400" />} label="Grievances" value={totalGrievances} sublabel="All time reports" />
        <StatCard icon={<Clock className="text-red-400" />} label="Pending" value={pendingGrievances} sublabel="Needs attention" />
        <StatCard icon={<CheckCircle className="text-green-400" />} label="Resolved" value={resolvedGrievances} sublabel="Successfully closed" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Recent Users List */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">New Members</h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-white/40 uppercase tracking-widest">Recent</span>
          </div>
          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u._id.toString()} className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#800000]/30 flex items-center justify-center text-[#FFD700] font-bold">
                    {u.name[0]}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{u.name}</p>
                    <p className="text-white/40 text-xs">{u.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white/60 text-[10px] uppercase">{u.role}</p>
                  <p className="text-white/30 text-[10px]">{new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Placeholder for Chart */}
        <div className="glass-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-500/10 flex items-center justify-center mb-4">
            <AlertTriangle className="text-yellow-500" size={32} />
          </div>
          <h3 className="text-white font-bold text-lg mb-2">Live Analytics</h3>
          <p className="text-white/40 text-sm max-w-xs">Detailed trends and booth-level analytics will appear here as data grows.</p>
          <div className="mt-8 w-full h-32 flex items-end justify-center gap-2 px-10">
             {[40, 70, 45, 90, 65, 80, 50].map((h, i) => (
               <div key={i} className="flex-1 bg-gradient-to-t from-[#800000] to-[#FFD700]/50 rounded-t-sm" style={{ height: `${h}%` }}></div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, sublabel }) {
  return (
    <div className="glass-card p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        {icon}
      </div>
      <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-white display-font mb-2">{value}</p>
      <p className="text-white/30 text-[10px]">{sublabel}</p>
    </div>
  );
}
