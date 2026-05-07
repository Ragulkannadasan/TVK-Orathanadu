'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function AdminGrievancesPage() {
  const [grievances, setGrievances] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);

  const fetchGrievances = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grievances?page=${page}`);
      const data = await res.json();
      setGrievances(data.grievances || []);
      setPages(data.pages || 1);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

  const handleUpdate = async (id, updates) => {
    setUpdating(id);
    try {
      await fetch(`/api/grievances/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      fetchGrievances();
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filterStatus ? grievances.filter((g) => g.status === filterStatus) : grievances;
  const statusCls = { Pending: 'badge-pending', Investigating: 'badge-investigating', Resolved: 'badge-resolved' };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">All Grievances</h1>
          <p className="tamil text-[#FFD700]/60 text-sm mt-0.5">அனைத்து புகார்கள் – {total} total</p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-white/40" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="input-dark text-sm w-36 py-2">
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="text-[#800000] animate-spin" size={32} /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl"><p className="text-white/40">No grievances found.</p></div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full hidden md:table">
            <thead>
              <tr className="border-b border-white/10">
                {['Ticket', 'User', 'Category', 'Description', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((g) => (
                <tr key={g._id} className="hover:bg-white/3 transition-colors">
                  <td className="px-4 py-3 text-[#FFD700] text-xs font-mono">{g.ticketId}</td>
                  <td className="px-4 py-3">
                    <p className="text-white/80 text-sm">{g.userId?.name || '—'}</p>
                    <p className="text-white/30 text-xs">{g.userId?.panchayat}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">{g.category}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-white/70 text-sm line-clamp-2">{g.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${statusCls[g.status]}`}>{g.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {updating === g._id ? (
                        <Loader2 size={14} className="animate-spin text-white/40" />
                      ) : (
                        ['Pending', 'Investigating', 'Resolved'].map((s) => (
                          <button
                            key={s}
                            onClick={() => g.status !== s && handleUpdate(g._id, { status: s })}
                            disabled={g.status === s}
                            className={`text-xs px-2 py-1 rounded transition-all ${g.status === s ? 'opacity-30 cursor-not-allowed text-white/40' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                          >
                            {s.slice(0, 3)}
                          </button>
                        ))
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Mobile */}
          <div className="md:hidden divide-y divide-white/5">
            {filtered.map((g) => (
              <div key={g._id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[#FFD700] text-xs font-mono">#{g.ticketId}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusCls[g.status]}`}>{g.status}</span>
                </div>
                <p className="text-white/70 text-sm mb-1 line-clamp-2">{g.description}</p>
                <p className="text-white/30 text-xs">{g.userId?.name} · {g.category} · {g.userId?.panchayat}</p>
                <div className="flex gap-1.5 mt-3">
                  {['Pending', 'Investigating', 'Resolved'].map((s) => (
                    <button
                      key={s}
                      onClick={() => g.status !== s && handleUpdate(g._id, { status: s })}
                      disabled={g.status === s || updating === g._id}
                      className={`flex-1 text-xs py-1.5 rounded transition-all ${g.status === s ? 'opacity-30 cursor-not-allowed' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center gap-1 text-white/50 text-sm hover:text-white disabled:opacity-30">
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-white/40 text-sm">Page {page} of {pages}</span>
          <button onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages} className="flex items-center gap-1 text-white/50 text-sm hover:text-white disabled:opacity-30">
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
