"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "@/actions/admin";

export default function UserTable({ initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(null); // stores userId of acting item

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(userId);
    const res = await deleteUser(userId);
    if (res.success) {
      setUsers(users.filter(u => u._id !== userId));
    } else {
      alert(res.error || "Failed to delete user");
    }
    setLoading(null);
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(userId);
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } else {
      alert(res.error || "Failed to update role");
    }
    setLoading(null);
  };

  const getRoleBadge = (role) => {
    const styles = {
      Admin: "bg-red-500/20 text-red-400 border-red-500/30",
      MLA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Poruppalar: "bg-[#FFD700]/20 text-[#FFD700] border-[#FFD700]/30",
      DistSecretary: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Voter: "bg-white/10 text-white/70 border-white/20",
    };
    return (
      <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${styles[role] || styles.Voter}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-white/40 text-xs uppercase tracking-wider">
            <th className="px-6 py-2">User / Member</th>
            <th className="px-6 py-2">Details</th>
            <th className="px-6 py-2">Role / Badge</th>
            <th className="px-6 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="glass-card-no-hover animate-fade-in">
              <td className="px-6 py-4 rounded-l-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#800000] to-[#FFD700]/20 flex items-center justify-center font-bold text-white shadow-inner">
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div className="text-white font-semibold">{user.name}</div>
                    <div className="text-white/40 text-xs">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-white/60 text-sm">
                  {user.boothNumber ? `Booth: ${user.boothNumber}` : "No Booth"}
                </div>
                <div className="text-white/30 text-xs italic">
                  {user.panchayat || "No Panchayat"}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col gap-2">
                  {getRoleBadge(user.role)}
                  <select 
                    value={user.role}
                    disabled={loading === user._id}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="bg-black/40 border border-white/10 text-[10px] text-white/50 rounded p-1 hover:border-[#FFD700]/30 transition-colors cursor-pointer outline-none"
                  >
                    <option value="Voter">VOTER</option>
                    <option value="Poruppalar">PORUPPALAR</option>
                    <option value="MLA">MLA</option>
                    <option value="DistSecretary">DIST SECRETARY</option>
                    <option value="Admin">ADMIN</option>
                  </select>
                </div>
              </td>
              <td className="px-6 py-4 rounded-r-2xl text-right">
                <button
                  onClick={() => handleDelete(user._id)}
                  disabled={loading === user._id}
                  className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                  title="Delete User"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {users.length === 0 && (
        <div className="text-center py-20 text-white/30">
          No members found.
        </div>
      )}
    </div>
  );
}
