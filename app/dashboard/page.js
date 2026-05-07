import { auth } from '@/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Grievance from '@/models/Grievance';
import Announcement from '@/models/Announcement';
import Notification from '@/models/Notification';
import MembershipCard from '@/components/MembershipCard';
import InstallButton from '@/components/InstallButton';
import Link from 'next/link';
import { FileText, Clock, CheckCircle, AlertCircle, Bell, Megaphone } from 'lucide-react';

export const metadata = { title: 'My Dashboard – TVK Orathanadu' };

export default async function DashboardPage() {
  const session = await auth();
  await dbConnect();

  const [userDoc, recentGrievances, counts, announcements, notifications] = await Promise.all([
    User.findById(session.user.userId).lean(),
    Grievance.find({ userId: session.user.userId })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean(),
    Grievance.aggregate([
      { $match: { userId: require('mongoose').Types.ObjectId.createFromHexString(session.user.userId) } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Announcement.find().sort({ createdAt: -1 }).limit(3).lean(),
    Notification.find({ userId: session.user.userId, isRead: false }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  // Next.js Server-to-Client Component Serialization fix
  const user = JSON.parse(JSON.stringify(userDoc));

  const statusMap = counts.reduce((acc, c) => ({ ...acc, [c._id]: c.count }), {});

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white display-font mb-1">
            வணக்கம்,{' '}
            <span className="gradient-text">{user?.name?.split(' ')[0] || 'Member'}</span>! 👋
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-2">Orathanadu Constituency 175 · {user?.panchayat || 'Profile Incomplete'}</p>
        </div>
        <InstallButton />
      </div>

      {/* Profile Incomplete Banner */}
      {(!user?.mobile || !user?.voterId || !user?.panchayat) && (
        <div className="mb-8 p-5 rounded-2xl bg-[#FFD700]/10 border border-[#FFD700]/30 flex flex-col sm:flex-row gap-4 items-center justify-between animate-fade-in shadow-[0_0_15px_rgba(255,215,0,0.1)]">
          <div>
            <h3 className="text-[#FFD700] font-bold text-lg">Complete Your Profile</h3>
            <p className="text-white/70 text-sm mt-1">Please provide your personal information to unlock your official digital membership card and ID.</p>
          </div>
          <Link href="/profile-setup" className="bg-[#FFD700] text-black font-bold px-6 py-2.5 rounded-lg whitespace-nowrap hover:bg-white transition-colors text-center">
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Membership Card */}
      <section className="mb-8">
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-4">
          🆔 Digital Membership Card
        </h2>
        <MembershipCard user={user} />
      </section>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Notifications */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Bell size={18} className="text-[#FFD700]" />
            <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
              🔔 Notifications
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-white/30 text-xs glass-card p-4 rounded-xl">No new notifications</p>
            ) : (
              notifications.map((n) => (
                <div key={n._id.toString()} className="glass-card p-4 rounded-xl border-l-2 border-blue-500">
                  <p className="text-white font-bold text-sm">{n.title}</p>
                  <p className="text-white/60 text-xs mt-1">{n.message}</p>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Announcements */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Megaphone size={18} className="text-[#FFD700]" />
            <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
              📢 Announcements
            </h2>
          </div>
          <div className="space-y-3">
            {announcements.length === 0 ? (
              <p className="text-white/30 text-xs glass-card p-4 rounded-xl">No announcements</p>
            ) : (
              announcements.map((a) => (
                <div key={a._id.toString()} className="glass-card p-4 rounded-xl border-l-2 border-[#800000]">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-[#FFD700] font-bold text-sm">{a.title}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#800000]/30 text-white/50">{a.type}</span>
                  </div>
                  <p className="text-white/60 text-xs line-clamp-2">{a.content}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider mb-4">
          📊 Grievance Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<FileText size={20} />} label="Total" value={(statusMap.Pending || 0) + (statusMap.Investigating || 0) + (statusMap.Resolved || 0)} color="text-white" />
          <StatCard icon={<Clock size={20} />} label="Pending" value={statusMap.Pending || 0} color="text-amber-400" />
          <StatCard icon={<AlertCircle size={20} />} label="Investigating" value={statusMap.Investigating || 0} color="text-blue-400" />
          <StatCard icon={<CheckCircle size={20} />} label="Resolved" value={statusMap.Resolved || 0} color="text-green-400" />
        </div>
      </section>

      {/* Recent Grievances */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white/70 text-sm font-semibold uppercase tracking-wider">
            📋 Recent Grievances
          </h2>
          <Link href="/dashboard/grievances" className="text-[#FFD700]/70 text-sm hover:text-[#FFD700] transition-colors">
            View All →
          </Link>
        </div>

        {recentGrievances.length === 0 ? (
          <div className="glass-card rounded-2xl p-10 text-center">
            <p className="text-white/60 text-base">No grievances submitted yet.</p>
            <Link href="/dashboard/grievances" className="btn-primary mt-4 inline-block text-sm px-6 py-2 rounded-lg">
              Submit First Grievance
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentGrievances.map((g) => (
              <div key={g._id.toString()} className="glass-card rounded-xl p-5 flex items-center justify-between hover:border-[#800000]/40 transition-colors">
                <div>
                  <span className="text-[#FFD700] text-xs font-mono">#{g.ticketId}</span>
                  <p className="text-white/80 text-sm mt-0.5 line-clamp-1">{g.description}</p>
                  <p className="text-white/40 text-xs mt-1">{g.category}</p>
                </div>
                <StatusPill status={g.status} />
              </div>
            ))}
          </div>
        )}

        {/* Quick Action */}
        <div className="mt-8 glass-card rounded-2xl p-6 border border-[#800000]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#800000]/20 rounded-full blur-2xl animate-pulse" />
          <h3 className="text-white font-bold text-lg mb-1 display-font relative z-10">Have an issue?</h3>
          <p className="tamil text-[#FFD700]/70 text-sm mb-4 relative z-10">ஒரு புகார் உள்ளதா?</p>
          <Link href="/dashboard/grievances#new" className="btn-primary text-sm px-5 py-2 rounded-lg inline-block">
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
      <div className={`flex justify-center mb-3 ${color} drop-shadow-[0_0_8px_currentColor]`}>{icon}</div>
      <p className={`text-3xl font-bold display-font ${color}`}>{value}</p>
      <p className="text-white/70 font-medium text-xs mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function StatusPill({ status }) {
  const colors = {
    Pending: 'badge-pending',
    Investigating: 'badge-investigating',
    Resolved: 'badge-resolved',
  };
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors[status] || ''}`}>
      {status}
    </span>
  );
}
