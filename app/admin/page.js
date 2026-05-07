'use client';
import { useState, useEffect } from 'react';
import { Loader2, Users, FileText, CheckCircle, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';

const STATUS_COLORS = { Pending: '#f59e0b', Investigating: '#3b82f6', Resolved: '#22c55e' };
const CATEGORY_COLORS = ['#800000', '#a00000', '#cc0000', '#ff3333', '#ff6666'];

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-[#800000]" size={32} />
      </div>
    );
  }

  if (!stats || stats.error) {
    return (
      <div className="p-8 text-center text-red-400">Access denied or error loading data.</div>
    );
  }

  const statusPieData = Object.entries(stats.statusBreakdown).map(([name, value]) => ({ name, value }));
  const categoryBarData = stats.categoryBreakdown.map((c) => ({ name: c._id, count: c.count }));
  const roleData = stats.roleBreakdown.map((r) => ({ name: r._id, count: r.count }));

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-xs mb-3">
          🛡️ Admin Portal
        </div>
        <h1 className="text-3xl font-bold text-white">Constituency Analytics</h1>
        <p className="tamil text-[#FFD700]/60 text-sm mt-1">ஓரத்தநாடு தொகுதி பகுப்பாய்வு</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <KPICard icon={<Users size={24}/>} label="Total Members" labelTa="மொத்த உறுப்பினர்கள்" value={stats.totalMembers} color="text-[#FFD700]" />
        <KPICard icon={<FileText size={24}/>} label="Total Grievances" labelTa="மொத்த புகார்கள்" value={stats.totalGrievances} color="text-white" />
        <KPICard icon={<Clock size={24}/>} label="Pending" labelTa="நிலுவையில்" value={stats.statusBreakdown.Pending} color="text-amber-400" />
        <KPICard icon={<CheckCircle size={24}/>} label="Resolved" labelTa="தீர்க்கப்பட்டது" value={stats.statusBreakdown.Resolved} color="text-green-400" />
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Grievance Status Pie */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Grievance Status Breakdown</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusPieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                {statusPieData.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#999'} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
              <Legend iconType="circle" wrapperStyle={{ color: '#a0a0a0', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Category Bar */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Grievances by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={categoryBarData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="name" tick={{ fill: '#a0a0a0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#a0a0a0', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 8, color: '#fff' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {categoryBarData.map((_, i) => (
                  <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Role Breakdown & Recent */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Role Breakdown */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Member Roles</h2>
          <div className="space-y-3">
            {roleData.map((r) => (
              <div key={r.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#800000]" />
                  <span className="text-white/70 text-sm">{r.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#800000] rounded-full"
                      style={{ width: `${(r.count / stats.totalMembers) * 100}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm w-6 text-right">{r.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Grievances */}
        <div className="glass rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-4">Recent Grievances</h2>
          <div className="space-y-3">
            {stats.recentGrievances.map((g) => (
              <div key={g._id} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-[#FFD700] text-xs font-mono">#{g.ticketId}</p>
                  <p className="text-white/70 text-xs mt-0.5 truncate">{g.description}</p>
                  <p className="text-white/30 text-xs mt-0.5">{g.userId?.name} · {g.userId?.panchayat}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${{Pending:'badge-pending',Investigating:'badge-investigating',Resolved:'badge-resolved'}[g.status]}`}>
                  {g.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, label, labelTa, value, color }) {
  return (
    <div className="glass rounded-xl p-5 border border-white/5">
      <div className={`${color} mb-2`}>{icon}</div>
      <p className={`text-3xl font-black ${color}`}>{value}</p>
      <p className="text-white/60 text-sm mt-1">{label}</p>
      <p className="tamil text-[#FFD700]/30 text-xs">{labelTa}</p>
    </div>
  );
}
