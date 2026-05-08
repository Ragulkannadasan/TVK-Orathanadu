import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Grievance from "@/models/Grievance";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  Clock, 
  MapPin, 
  TrendingUp, 
  UserCheck, 
  BarChart3,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Admin Analytics – TVK Orathanadu" };

export default async function AdminDashboard() {
  await dbConnect();
  
  // 1. Core Metrics
  const [
    totalUsers, 
    totalGrievances, 
    pendingGrievances, 
    resolvedGrievances,
    completeProfiles,
    uniqueBooths
  ] = await Promise.all([
    User.countDocuments(),
    Grievance.countDocuments(),
    Grievance.countDocuments({ status: { $in: ["Pending", "Investigating"] } }),
    Grievance.countDocuments({ status: "Resolved" }),
    User.countDocuments({ isProfileComplete: true }),
    User.distinct("boothNumber").then(res => res.filter(Boolean).length)
  ]);

  // 2. Role Distribution
  const roleData = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // 3. Category Distribution for Grievances
  const grievanceCategories = await Grievance.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // 4. Top Panchayats (Growth Areas)
  const topPanchayats = await User.aggregate([
    { $match: { panchayat: { $ne: null, $ne: "" } } },
    { $group: { _id: "$panchayat", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 }
  ]);

  // 5. Growth Timeline (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const growthTimeline = await User.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  const completionRate = totalUsers > 0 ? Math.round((completeProfiles / totalUsers) * 100) : 0;

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto pb-20">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-1 bg-[#FFD700] rounded-full" />
          <span className="text-[#FFD700] text-xs font-black uppercase tracking-[0.3em]">Live Intelligence</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-white display-font mb-2">Admin <span className="gradient-text">Analytics</span></h1>
        <p className="text-white/40 text-sm md:text-base max-w-2xl">Real-time demographic and performance data for Constituency 175.</p>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard 
          icon={<Users className="text-[#FFD700]" />} 
          label="Total Members" 
          value={totalUsers} 
          trend="+ Live"
          color="border-[#FFD700]/10"
        />
        <StatCard 
          icon={<Clock className="text-red-400" />} 
          label="Active Issues" 
          value={pendingGrievances} 
          trend="Action Needed"
          color="border-red-500/10"
        />
        <StatCard 
          icon={<MapPin className="text-blue-400" />} 
          label="Booth Coverage" 
          value={uniqueBooths} 
          trend="Unique Spots"
          color="border-blue-500/10"
        />
        <StatCard 
          icon={<UserCheck className="text-green-400" />} 
          label="Verified Users" 
          value={`${completionRate}%`} 
          trend="Profile Comp."
          color="border-green-500/10"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Role Distribution Chart (CSS Based) */}
        <div className="lg:col-span-1 glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <BarChart3 size={18} className="text-[#FFD700]" /> Designation Mix
            </h3>
          </div>
          <div className="space-y-6">
            {roleData.map((role) => {
              const percentage = totalUsers > 0 ? (role.count / totalUsers) * 100 : 0;
              return (
                <div key={role._id}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">{role._id}</span>
                    <span className="text-white text-xs font-bold">{role.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#800000] to-[#FFD700] transition-all duration-1000" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Grievance Categories */}
        <div className="lg:col-span-1 glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <FileText size={18} className="text-[#FFD700]" /> Issue Categories
            </h3>
          </div>
          <div className="space-y-4">
            {grievanceCategories.length > 0 ? grievanceCategories.map((cat) => (
              <div key={cat._id} className="flex items-center justify-between p-3 rounded-xl bg-white/2 border border-white/5">
                <span className="text-white/70 text-xs font-bold uppercase">{cat._id}</span>
                <span className="text-[#FFD700] font-black text-sm">{cat.count}</span>
              </div>
            )) : (
              <div className="py-10 text-center text-white/20 text-xs uppercase tracking-widest font-bold">No Data Recorded</div>
            )}
          </div>
        </div>

        {/* Growth Timeline Line Chart Simulation */}
        <div className="lg:col-span-1 glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-white font-bold flex items-center gap-2">
              <TrendingUp size={18} className="text-[#FFD700]" /> 7D Growth
            </h3>
          </div>
          <div className="h-48 flex items-end gap-2 px-2">
            {/* Generate 7 bars for the last 7 days */}
            {Array.from({ length: 7 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (6 - i));
              const dateStr = d.toISOString().split('T')[0];
              const dataPoint = growthTimeline.find(g => g._id === dateStr);
              const count = dataPoint ? dataPoint.count : 0;
              const maxCount = Math.max(...growthTimeline.map(g => g.count), 5);
              const height = (count / maxCount) * 100;
              
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="w-full relative">
                    <div 
                      className="w-full bg-gradient-to-t from-[#800000] to-[#FFD700] rounded-t-sm transition-all duration-1000 group-hover:opacity-80"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    >
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-bold text-[#FFD700] opacity-0 group-hover:opacity-100 transition-opacity">
                        {count}
                      </div>
                    </div>
                  </div>
                  <span className="text-[7px] text-white/30 uppercase font-bold">{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Section: Top Panchayats */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6 border-white/5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold flex items-center gap-2">
              <MapPin size={18} className="text-[#FFD700]" /> High Coverage Panchayats
            </h3>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left">
                <thead>
                   <tr className="text-white/20 text-[10px] uppercase font-black tracking-widest border-b border-white/5">
                      <th className="py-4 px-2">Panchayat Name</th>
                      <th className="py-4 px-2 text-right">Member Count</th>
                      <th className="py-4 px-2 text-right">Coverage</th>
                   </tr>
                </thead>
                <tbody>
                   {topPanchayats.map((p) => (
                      <tr key={p._id} className="border-b border-white/5 group hover:bg-white/2 transition-colors">
                         <td className="py-4 px-2 text-white font-bold text-sm tracking-tight">{p._id}</td>
                         <td className="py-4 px-2 text-right text-white/60 font-mono text-sm">{p.count}</td>
                         <td className="py-4 px-2 text-right">
                            <div className="inline-block px-2 py-0.5 rounded bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-black uppercase">
                               Top 5
                            </div>
                         </td>
                      </tr>
                   ))}
                   {topPanchayats.length === 0 && (
                      <tr>
                         <td colSpan="3" className="py-10 text-center text-white/20 uppercase text-xs font-bold">No Panchayat Data Available</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
        </div>

        {/* Quick Links / Actions */}
        <div className="lg:col-span-1 flex flex-col gap-4">
           <Link href="/dashboard/admin/users" className="glass-card p-6 border-white/5 group hover:border-[#FFD700]/30 transition-all flex items-center justify-between">
              <div>
                 <h4 className="text-white font-bold text-sm mb-1">Review Members</h4>
                 <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">Verify and Manage Roles</p>
              </div>
              <ChevronRight className="text-white/20 group-hover:text-[#FFD700] transition-colors" />
           </Link>
           <Link href="/dashboard/admin/grievances" className="glass-card p-6 border-white/5 group hover:border-red-500/30 transition-all flex items-center justify-between">
              <div>
                 <h4 className="text-white font-bold text-sm mb-1">Pending Grievances</h4>
                 <p className="text-white/40 text-[10px] uppercase font-bold tracking-widest">{pendingGrievances} Issues to resolve</p>
              </div>
              <ChevronRight className="text-white/20 group-hover:text-red-500 transition-colors" />
           </Link>
           <div className="glass-card p-6 border-[#FFD700]/10 bg-gradient-to-br from-[#800000]/20 to-transparent">
              <h4 className="text-[#FFD700] font-black text-xs uppercase tracking-widest mb-3">System Integrity</h4>
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                 <span className="text-white/60 text-[10px] font-bold">DB Status: Operational</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                 <span className="text-white/60 text-[10px] font-bold">Data Sync: Live Aggregate</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, trend, color }) {
  return (
    <div className={`glass-card p-6 relative overflow-hidden group border-white/5 ${color}`}>
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-40 transition-all group-hover:scale-110">
        {icon}
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.15em]">{label}</p>
        </div>
        <p className="text-4xl font-black text-white display-font mb-2">{value}</p>
        <div className="flex items-center gap-1.5">
           <div className="w-1 h-1 rounded-full bg-[#FFD700] animate-pulse" />
           <p className="text-[#FFD700] text-[9px] font-black uppercase tracking-widest">{trend}</p>
        </div>
      </div>
    </div>
  );
}
