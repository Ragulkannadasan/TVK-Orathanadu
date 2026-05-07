'use client';
import { useState, useEffect, useCallback } from 'react';
import { TicketCard } from '@/components/GrievanceComponents';
import { Loader2, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';

export default function PoruppalarGrievancesPage() {
  const [grievances, setGrievances] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [updating, setUpdating] = useState(null);
  const [actionModal, setActionModal] = useState(null);
  const [actionNotes, setActionNotes] = useState('');

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

  const handleActionSubmit = async () => {
    if (!actionModal || !actionNotes.trim()) return;
    await handleUpdate(actionModal._id, { status: 'Investigating', actionNotes });
    setActionModal(null);
    setActionNotes('');
  };

  const filtered = filterStatus ? grievances.filter((g) => g.status === filterStatus) : grievances;

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Booth Grievances</h1>
          <p className="tamil text-[#FFD700]/60 text-sm mt-0.5">சாவடி புகார்கள் – {total} total</p>
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-white/40" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="input-dark text-sm w-36 py-2"
          >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Investigating">Investigating</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10 animate-fade-in-up">
            <h3 className="text-white font-bold text-lg mb-1">Add Action Notes</h3>
            <p className="text-white/50 text-sm mb-4">Ticket: <span className="text-[#FFD700]">#{actionModal.ticketId}</span></p>
            <textarea
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
              placeholder="Describe the action taken..."
              rows={4}
              className="input-dark resize-none mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setActionModal(null)} className="btn-secondary flex-1 py-2.5 rounded-xl">Cancel</button>
              <button onClick={handleActionSubmit} disabled={!actionNotes.trim()} className="btn-primary flex-[2] py-2.5 rounded-xl disabled:opacity-50">
                Save & Mark Investigating
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-[#800000] animate-spin" size={32} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-white/50">No grievances found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((g) => (
            <div key={g._id} className="glass rounded-xl p-4 border border-white/5">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center mb-2">
                    <span className="text-[#FFD700] text-xs font-mono font-bold">#{g.ticketId}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">{g.category}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${{Pending:'badge-pending',Investigating:'badge-investigating',Resolved:'badge-resolved'}[g.status]}`}>{g.status}</span>
                  </div>
                  <p className="text-white/80 text-sm">{g.description}</p>
                  <p className="text-white/40 text-xs mt-1">
                    By: {g.userId?.name || 'Unknown'} · {new Date(g.createdAt).toLocaleDateString('en-IN')}
                  </p>
                  {g.actionNotes && (
                    <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                      <p className="text-green-400 text-xs">Action: {g.actionNotes}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-white/5">
                {g.status !== 'Investigating' && (
                  <button
                    onClick={() => setActionModal(g)}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                  >
                    🔍 Add Action Notes
                  </button>
                )}
                {g.status !== 'Resolved' && (
                  <button
                    onClick={() => handleUpdate(g._id, { status: 'Resolved' })}
                    disabled={updating === g._id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-all disabled:opacity-50"
                  >
                    {updating === g._id ? '...' : '✅ Mark Resolved'}
                  </button>
                )}
                {g.status !== 'Pending' && (
                  <button
                    onClick={() => handleUpdate(g._id, { status: 'Pending' })}
                    disabled={updating === g._id}
                    className="text-xs px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all disabled:opacity-50"
                  >
                    ↩️ Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
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
