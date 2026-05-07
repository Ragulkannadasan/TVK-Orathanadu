'use client';
import { useState, useEffect, useCallback } from 'react';
import { TicketCard, StatusBadge, CategoryBadge } from '@/components/GrievanceComponents';
import { Loader2, Plus, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';

const categories = ['Agriculture', 'Water', 'Road', 'Electricity', 'Other'];

export default function GrievancesPage() {
  const [grievances, setGrievances] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({ category: '', description: '' });

  const fetchGrievances = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/grievances?page=${page}`);
      const data = await res.json();
      setGrievances(data.grievances || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {
      setError('Failed to load grievances');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchGrievances(); }, [fetchGrievances]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.description) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(`Grievance submitted! Ticket: ${data.grievance.ticketId}`);
      setForm({ category: '', description: '' });
      setShowForm(false);
      fetchGrievances();
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">My Grievances</h1>
          <p className="tamil text-[#FFD700]/60 text-sm mt-0.5">என் புகார்கள் – {total} total</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          id="new-grievance-btn"
          className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-lg"
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          {showForm ? 'Cancel' : 'New Grievance'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm animate-fade-in">
          ✅ {success}
        </div>
      )}
      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
          ❌ {error}
        </div>
      )}

      {/* New Grievance Form */}
      {showForm && (
        <div className="glass rounded-2xl p-6 mb-6 border border-[#800000]/30 animate-fade-in-up">
          <h2 className="text-white font-semibold text-lg mb-1">Submit New Grievance</h2>
          <p className="tamil text-[#FFD700]/60 text-sm mb-5">புதிய புகாரை தெரிவிக்கவும்</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Category <span className="tamil text-[#FFD700]/50 text-xs">(வகை)</span> *
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, category: cat }))}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      form.category === cat
                        ? 'bg-[#800000] text-[#FFD700] shadow-lg'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {cat === 'Agriculture' && '🌾 '}
                    {cat === 'Water' && '💧 '}
                    {cat === 'Road' && '🛣️ '}
                    {cat === 'Electricity' && '⚡ '}
                    {cat === 'Other' && '📋 '}
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2" htmlFor="desc">
                Description <span className="tamil text-[#FFD700]/50 text-xs">(விவரம்)</span> *
              </label>
              <textarea
                id="desc"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Describe the issue in detail..."
                required
                rows={4}
                className="input-dark resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={submitting || !form.category || !form.description}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 rounded-xl disabled:opacity-50"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? 'Submitting...' : 'Submit Grievance'}
            </button>
          </form>
        </div>
      )}

      {/* Grievances List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="text-[#800000] animate-spin" size={32} />
        </div>
      ) : grievances.length === 0 ? (
        <div className="text-center py-20 glass rounded-2xl">
          <p className="text-4xl mb-4">📋</p>
          <p className="text-white/50">No grievances yet. Submit your first one!</p>
          <p className="tamil text-[#FFD700]/40 text-sm mt-1">இன்னும் புகார்கள் இல்லை</p>
        </div>
      ) : (
        <div className="space-y-4">
          {grievances.map((g) => (
            <TicketCard key={g._id} grievance={g} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center gap-1 text-white/50 text-sm hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="text-white/40 text-sm">Page {page} of {pages}</span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="flex items-center gap-1 text-white/50 text-sm hover:text-white disabled:opacity-30 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
