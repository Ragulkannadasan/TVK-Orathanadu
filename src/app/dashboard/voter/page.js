import { getSessionUser } from "@/lib/session";
import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import MembershipCard from "@/components/MembershipCard";
import InstallButton from "@/components/InstallButton";
import Link from "next/link";
import { FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";

export const metadata = { title: "My Dashboard – TVK Orathanadu" };

export default async function VoterDashboard() {
  const userDoc = await getSessionUser();
  
  if (!userDoc) {
    redirect("/login");
  }

  await dbConnect();

  const grievances = await Grievance.find({ userId: userDoc._id })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  // Manually convert grievances to plain objects
  const recentGrievances = grievances.map(g => ({
    ...g,
    _id: g._id.toString(),
    userId: g.userId.toString(),
    createdAt: g.createdAt?.toISOString(),
  }));

  const counts = await Grievance.aggregate([
    { $match: { userId: userDoc._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  const statusMap = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground display-font mb-1">
            வணக்கம்,{" "}
            <span className="gradient-text">{userDoc.name?.split(" ")[0] || "Member"}</span>! 👋
          </h1>
          <p className="text-text-muted text-sm md:text-base mt-2">
            Orathanadu Constituency 175 · {userDoc.panchayat || "Profile Incomplete"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InstallButton />
        </div>
      </div>

      {/* Profile Incomplete Banner */}
      {(!userDoc.mobile && !userDoc.panchayat && !userDoc.boothNumber) && (
        <div className="mb-8 p-5 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          <div>
            <h3 className="text-gold-dynamic font-bold text-lg">Complete Your Profile</h3>
            <p className="text-foreground/70 text-sm mt-1">Please provide your personal information to unlock your official digital membership card and ID.</p>
          </div>
          <Link href="/dashboard/profile" className="bg-[#FFD700] text-black font-bold px-6 py-2.5 rounded-lg whitespace-nowrap hover:bg-white transition-colors text-center">
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Membership Card */}
      <section className="mb-8">
        <h2 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-4">
          🆔 Digital Membership Card
        </h2>
        <MembershipCard user={userDoc} />
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-text-muted text-sm font-semibold uppercase tracking-wider mb-4">
          📊 Grievance Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FileText size={20} />} label="Total" value={(statusMap.Pending || 0) + (statusMap.Investigating || 0) + (statusMap.Resolved || 0)} color="text-foreground" />
          <StatCard icon={<Clock size={20} />} label="Pending" value={statusMap.Pending || 0} color="text-amber-500 dark:text-amber-400" />
          <StatCard icon={<AlertCircle size={20} />} label="Investigating" value={statusMap.Investigating || 0} color="text-blue-500 dark:text-blue-400" />
          <StatCard icon={<CheckCircle size={20} />} label="Resolved" value={statusMap.Resolved || 0} color="text-green-500 dark:text-green-400" />
        </div>
      </section>

      {/* Recent Grievances */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-foreground/70 text-sm font-semibold uppercase tracking-wider">
            📋 Recent Grievances
          </h2>
          <Link href="/dashboard/grievances" className="text-gold-dynamic/70 text-sm hover:text-gold-dynamic transition-colors">
            View All →
          </Link>
        </div>

        {recentGrievances.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-text-muted text-base">No grievances submitted yet.</p>
            <Link href="/dashboard/grievances" className="btn-primary mt-4 inline-block text-sm px-6 py-2 rounded-lg">
              Submit First Grievance
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGrievances.map((g) => (
              <div key={g._id} className="glass-card rounded-xl p-5 flex items-center justify-between hover:border-[#800000]/40 transition-colors">
                <div>
                  <p className="text-foreground/80 text-sm mt-0.5 line-clamp-1 font-bold">{g.title}</p>
                  <p className="text-text-muted text-xs mt-1">{g.category}</p>
                </div>
                <StatusPill status={g.status} />
              </div>
            ))}
          </div>
        )}

        {/* Quick Action */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-[#800000]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#800000]/20 rounded-full blur-2xl animate-pulse" />
          <h3 className="text-foreground font-bold text-lg mb-1 display-font relative z-10">Have an issue?</h3>
          <p className="tamil text-gold-dynamic/70 text-sm mb-4 relative z-10">ஒரு புகார் உள்ளதா?</p>
          <Link href="/dashboard/grievances" className="btn-primary text-sm px-5 py-2 rounded-lg inline-block relative z-10">
            📢 Report Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <div className={`flex justify-center mb-3 ${color} drop-shadow-sm dark:drop-shadow-[0_0_8px_currentColor]`}>{icon}</div>
      <p className={`text-3xl font-bold display-font ${color}`}>{value}</p>
      <p className="text-text-muted font-medium text-xs mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const colors = {
    Pending: "badge-pending",
    Investigating: "badge-investigating",
    Resolved: "badge-resolved",
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || ""}`}>
      {status}
    </span>
  );
}
