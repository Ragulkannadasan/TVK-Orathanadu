import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import Grievance from '@/models/Grievance';
import User from '@/models/User';
import Link from 'next/link';

export const metadata = { title: 'Poruppalar Dashboard – TVK Orathanadu' };

export default async function PoruppalarPage() {
  const session = await auth();
  await dbConnect();

  const poruppalar = await User.findById(session.user.userId).lean();

  // Get all voters in this panchayat
  const votersInPanchayat = await User.find({ panchayat: poruppalar.panchayat }).select('_id').lean();
  const voterIds = votersInPanchayat.map((v) => v._id);

  const [totalGrievances, pendingCount, investigatingCount, resolvedCount, recentGrievances] = await Promise.all([
    Grievance.countDocuments({ userId: { $in: voterIds } }),
    Grievance.countDocuments({ userId: { $in: voterIds }, status: 'Pending' }),
    Grievance.countDocuments({ userId: { $in: voterIds }, status: 'Investigating' }),
    Grievance.countDocuments({ userId: { $in: voterIds }, status: 'Resolved' }),
    Grievance.find({ userId: { $in: voterIds } })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name boothNumber')
      .lean(),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-xs mb-3">
          ⭐ Poruppalar Portal
        </div>
        <h1 className="text-3xl font-bold text-white">
          வணக்கம், <span className="gradient-text">{poruppalar?.name || 'Poruppalar'}</span>!
        </h1>
        <p className="text-white/50 mt-1">
          Panchayat: <strong className="text-[#FFD700]/80">{poruppalar?.panchayat || '—'}</strong> · {votersInPanchayat.length} registered voters
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" value={totalGrievances} emoji="📋" color="text-white" bg="bg-white/5" />
        <StatCard label="Pending" value={pendingCount} emoji="⏳" color="text-amber-400" bg="bg-amber-500/10" />
        <StatCard label="Investigating" value={investigatingCount} emoji="🔍" color="text-blue-400" bg="bg-blue-500/10" />
        <StatCard label="Resolved" value={resolvedCount} emoji="✅" color="text-green-400" bg="bg-green-500/10" />
      </div>

      {/* Recent Grievances */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">Recent Panchayat Grievances</h2>
        <Link href="/poruppalar/grievances" className="text-[#FFD700]/60 text-sm hover:text-[#FFD700]">
          View All →
        </Link>
      </div>

      {recentGrievances.length === 0 ? (
        <div className="glass rounded-xl p-8 text-center">
          <p className="text-white/40">No grievances in your panchayat yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentGrievances.map((g) => (
            <div key={g._id.toString()} className="glass rounded-xl p-4 flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-[#FFD700] text-xs font-mono">#{g.ticketId}</span>
                  <span className="text-white/40 text-xs">{g.category}</span>
                </div>
                <p className="text-white/80 text-sm line-clamp-1">{g.description}</p>
                <p className="text-white/40 text-xs mt-1">
                  By: {g.userId?.name || 'Unknown'} · Booth #{g.userId?.boothNumber || '?'}
                </p>
              </div>
              <StatusPill status={g.status} />
            </div>
          ))}
        </div>
      )}

      {/* Quick note */}
      <div className="mt-6 glass rounded-xl p-5 border border-blue-500/20">
        <p className="text-white font-medium">Manage Grievances</p>
        <p className="tamil text-[#FFD700]/50 text-sm">புகார்களை நிர்வகிக்கவும்</p>
        <Link href="/poruppalar/grievances" className="btn-primary text-sm px-5 py-2 rounded-lg inline-block mt-3">
          Open Grievance Portal →
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, value, emoji, color, bg }) {
  return (
    <div className={`${bg} glass rounded-xl p-4 text-center border border-white/5`}>
      <p className="text-2xl mb-1">{emoji}</p>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-white/40 text-xs mt-0.5">{label}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const cls = { Pending: 'badge-pending', Investigating: 'badge-investigating', Resolved: 'badge-resolved' };
  return <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${cls[status] || ''}`}>{status}</span>;
}
