'use client';
import { useState, useEffect, useCallback } from 'react';
import { Loader2, Search, ChevronLeft, ChevronRight, Shield, Star, User } from 'lucide-react';

const roleConfig = {
  Voter: { label: 'Voter', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30', icon: User },
  Poruppalar: { label: 'Poruppalar', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30', icon: Star },
  Admin: { label: 'Admin', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30', icon: Shield },
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => { setDebouncedSearch(search); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, search: debouncedSearch });
      const res = await fetch(`/api/admin/users?${params}`);
      const data = await res.json();
      setUsers(data.users || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId, role) => {
    setUpdating(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    setUpdating(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isBlocked }),
      });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setUpdating(userId);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      fetchUsers();
    } finally {
      setUpdating(null);
    }
  };

  const [notificationModal, setNotificationModal] = useState(null);
  const [notifData, setNotifData] = useState({ title: '', message: '' });

  const handleSendNotification = async () => {
    if (!notifData.title || !notifData.message) return;
    try {
      await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: notificationModal, ...notifData }),
      });
      setNotificationModal(null);
      setNotifData({ title: '', message: '' });
      alert('Notification sent!');
    } catch (err) {
      alert('Failed to send notification');
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
        <p className="tamil text-[#FFD700]/60 text-sm mt-0.5">பயனர் நிர்வாகம் – {total} total</p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, panchayat..."
          className="input-dark pl-10"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-[#800000]" size={32} />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 glass rounded-2xl">
          <p className="text-white/40">No users found.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block glass rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-5 py-3">Member</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-5 py-3">Panchayat / Booth</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-5 py-3">Role</th>
                  <th className="text-left text-white/40 text-xs font-semibold uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => {
                  const rc = roleConfig[u.role] || roleConfig.Voter;
                  const RoleIcon = rc.icon;
                  return (
                    <tr key={u._id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#800000]/40 border border-[#800000]/60 flex items-center justify-center">
                            <span className="text-[#FFD700] text-xs font-bold">
                              {(u.name || u.email)?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{u.name || '(No name)'}</p>
                            <p className="text-white/40 text-xs">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white/70 text-sm truncate max-w-[150px]">{u.panchayat || '—'}</p>
                        <p className="text-white/30 text-xs">Booth #{u.boothNumber || '?'}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${rc.bg} ${rc.color}`}>
                          <RoleIcon size={10} /> {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center gap-1">
                            {updating === u._id ? (
                              <Loader2 size={14} className="animate-spin text-white/40" />
                            ) : (
                              ['Voter', 'Poruppalar', 'Admin'].map((r) => (
                                <button
                                  key={r}
                                  onClick={() => u.role !== r && handleRoleChange(u._id, r)}
                                  disabled={u.role === r}
                                  className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                                    u.role === r
                                      ? 'bg-white/10 text-white/30 cursor-not-allowed'
                                      : 'bg-white/5 text-white/60 hover:bg-[#800000]/30 hover:text-white'
                                  }`}
                                >
                                  {r}
                                </button>
                              ))
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleBlockUser(u._id, !u.isBlocked)}
                              className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                                u.isBlocked
                                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                  : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                              }`}
                            >
                              {u.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u._id)}
                              className="text-[10px] px-2 py-0.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setNotificationModal(u._id)}
                              className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-all"
                            >
                              Notify
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-3">
            {users.map((u) => {
              const rc = roleConfig[u.role] || roleConfig.Voter;
              return (
                <div key={u._id} className="glass rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">{u.name || '(No name)'}</p>
                      <p className="text-white/40 text-xs">{u.email}</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${rc.bg} ${rc.color}`}>{u.role}</span>
                  </div>
                  <p className="text-white/50 text-xs mb-3">{u.panchayat || 'No panchayat'} · Booth #{u.boothNumber || '?'}</p>
                  <div className="flex gap-1.5">
                    {['Voter', 'Poruppalar', 'Admin'].map((r) => (
                      <button
                        key={r}
                        onClick={() => u.role !== r && handleRoleChange(u._id, r)}
                        disabled={u.role === r || updating === u._id}
                        className={`flex-1 text-xs py-1.5 rounded-lg transition-all ${
                          u.role === r ? 'bg-white/10 text-white/30' : 'bg-white/5 text-white/60 hover:bg-[#800000]/30 hover:text-white'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Pagination */}
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
      {/* Notification Modal */}
      {notificationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass rounded-2xl p-6 w-full max-w-md border border-white/10 animate-fade-in-up">
            <h3 className="text-white font-bold text-lg mb-4">Send Notification</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-1">Title</label>
                <input
                  type="text"
                  value={notifData.title}
                  onChange={(e) => setNotifData({ ...notifData, title: e.target.value })}
                  placeholder="Notification title"
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-1">Message</label>
                <textarea
                  value={notifData.message}
                  onChange={(e) => setNotifData({ ...notifData, message: e.target.value })}
                  placeholder="Enter message..."
                  rows={4}
                  className="input-dark resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setNotificationModal(null)}
                  className="btn-secondary flex-1 py-2 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendNotification}
                  disabled={!notifData.title || !notifData.message}
                  className="btn-primary flex-[2] py-2 rounded-xl disabled:opacity-50"
                >
                  Send Notification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
