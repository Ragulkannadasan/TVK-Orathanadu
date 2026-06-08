import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Grievance from "@/models/Grievance";
import { Star, ShieldAlert, CheckCircle2, ListFilter } from "lucide-react";

export const metadata = { title: "Leader Dashboard – TVK Orathanadu" };

export default async function LeaderDashboard() {
  const session = await auth();
  await dbConnect();

  const user = await User.findOne({ email: session.user.email }).lean();
  
  // Poruppalars manage grievances in their panchayat
  const grievances = await Grievance.find({ panchayat: user?.panchayat })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const stats = await Grievance.aggregate([
    { $match: { panchayat: user?.panchayat } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusMap = stats.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {});

  return (
    <div className="p-4 md:p-6 max-w-7xl">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold text-foreground display-font mb-1">
            Leader <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base mt-2">
            Panchayat: <span className="text-gold-dynamic">{user?.panchayat || "Not Assigned"}</span> · Booths Manager
          </p>
        </div>
        <div className="hidden sm:block text-right">
           <p className="text-text-muted text-[10px] uppercase tracking-widest mb-1">Active Role</p>
           <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-2">
              <Star size={12} /> Poruppalar
           </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        <LeaderStat icon={<ShieldAlert className="text-amber-400" />} label="Open Tickets" value={statusMap.Pending || 0} color="border-amber-500/30" />
        <LeaderStat icon={<Star className="text-blue-400" />} label="In Progress" value={statusMap.Investigating || 0} color="border-blue-500/30" />
        <LeaderStat icon={<CheckCircle2 className="text-green-400" />} label="Resolved" value={statusMap.Resolved || 0} color="border-green-500/30" />
      </div>

      {/* Booth Grievances List */}
      <div className="glass-card overflow-hidden">
        <div className="p-6 border-b border-surface-border flex items-center justify-between">
          <h3 className="text-foreground font-bold text-lg">Panchayat Grievances</h3>
          <button className="text-text-muted hover:text-foreground transition-colors">
            <ListFilter size={20} />
          </button>
        </div>
        <div className="divide-y divide-white/5">
          {grievances.length === 0 ? (
            <div className="p-20 text-center text-text-muted">No grievances found in your panchayat.</div>
          ) : (
            grievances.map((g) => (
              <div key={g._id.toString()} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full ${g.status === 'Pending' ? 'bg-amber-500' : g.status === 'Resolved' ? 'bg-green-500' : 'bg-blue-500'}`} />
                    <h4 className="text-foreground font-bold text-sm">{g.title}</h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-border/10 text-text-muted uppercase">{g.category}</span>
                  </div>
                  <p className="text-text-muted text-xs line-clamp-1">{g.description}</p>
                  <p className="text-text-muted text-[10px] mt-1">Booth: {g.boothNumber || 'N/A'} · {new Date(g.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-1.5 rounded-lg bg-surface-border/10 text-foreground text-xs font-bold hover:bg-surface-border/20 transition-colors">
                    Manage
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function LeaderStat({ icon, label, value, color }) {
  return (
    <div className={`glass-card p-6 border-l-4 ${color}`}>
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-surface-border/10">
          {icon}
        </div>
        <div>
          <p className="text-text-muted text-xs font-bold uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-black text-foreground display-font">{value}</p>
        </div>
      </div>
    </div>
  );
}
