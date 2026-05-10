"use client";

import { useState } from "react";
import { deleteUser, updateUserRole } from "@/actions/admin";
import { X, User as UserIcon, Phone, CreditCard, MapPin, Hash, Calendar } from "lucide-react";

export default function UserTable({ initialUsers, currentUserEmail, pagination }) {
  const [users, setUsers] = useState(initialUsers);
  const [loading, setLoading] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [roleUser, setRoleUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(pagination.search || "");

  const handleDelete = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    setLoading(userId);
    const res = await deleteUser(userId);
    if (res.success) {
      setUsers(users.filter(u => u._id !== userId));
      if (selectedUser?._id === userId) setSelectedUser(null);
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
      if (selectedUser?._id === userId) setSelectedUser({ ...selectedUser, role: newRole });
    } else {
      alert(res.error || "Failed to update role");
    }
    setLoading(null);
  };

  const getRoleBadge = (role, size = "sm") => {
    const styles = {
      Admin: "bg-red-500/20 text-red-400 border-red-500/30",
      MLA: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      Poruppalar: "bg-[#FFD700]/20 text-gold-dynamic border-[#FFD700]/30",
      DistSecretary: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      Voter: "bg-surface-border/20 text-foreground/70 border-white/20",
    };
    const textSize = size === "lg" ? "text-xs px-3 py-1.5" : "text-[10px] px-2 py-1";
    return (
      <span className={`${textSize} rounded-md font-bold border ${styles[role] || styles.Voter}`}>
        {role.toUpperCase()}
      </span>
    );
  };

  const getRoleColors = (role) => {
    const colors = {
      Admin: "from-red-600 to-red-900 text-red-100 border-red-500/50",
      MLA: "from-purple-600 to-purple-900 text-purple-100 border-purple-500/50",
      Poruppalar: "from-[#FFD700] to-[#b8860b] text-black border-[#FFD700]/50",
      DistSecretary: "from-blue-600 to-blue-900 text-blue-100 border-blue-500/50",
      Voter: "from-white/10 to-white/5 text-foreground/70 border-surface-border",
    };
    return colors[role] || colors.Voter;
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/dashboard/admin/users?search=${searchTerm}&page=1`;
  };

  const handlePageChange = (newPage) => {
    window.location.href = `/dashboard/admin/users?search=${searchTerm}&page=${newPage}`;
  };

  return (
    <div className="w-full">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 input-dark bg-surface/50 border-surface-border text-sm"
          />
          <button type="submit" className="btn-primary py-2 px-6 text-xs">Search</button>
        </form>
      </div>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-text-muted text-xs uppercase tracking-wider">
              <th className="px-6 py-2">User / Member</th>
              <th className="px-6 py-2">Details</th>
              <th className="px-6 py-2">Role / Badge</th>
              <th className="px-6 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.email === currentUserEmail;
              return (
                <tr key={user._id} className="glass-card-no-hover animate-fade-in group">
                  <td className="px-6 py-4 rounded-l-2xl cursor-pointer" onClick={() => setSelectedUser(user)}>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full p-0.5 bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700]">
                          <div className="w-full h-full rounded-full bg-background p-0.5">
                            <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border border-surface-border">
                              {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-foreground font-bold text-xs">{user.name?.[0]?.toUpperCase()}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="text-foreground font-semibold group-hover:text-gold-dynamic transition-colors">{user.name}</div>
                          {isSelf && (
                            <span className="text-[8px] bg-surface-border/20 text-text-muted px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">You</span>
                          )}
                        </div>
                        <div className="text-gold-dynamic/70 text-[10px] font-bold tracking-tight">@{user.username || user.email.split('@')[0]}</div>
                        <div className="text-text-muted/50 text-[9px]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                <td className="px-6 py-4">
                  <div className="text-text-muted text-sm">
                    {user.boothNumber ? `Booth: ${user.boothNumber}` : "No Booth"}
                  </div>
                  <div className="text-text-muted text-xs italic">
                    {user.panchayat || "No Panchayat"}
                  </div>
                </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        disabled={loading === user._id || isSelf}
                        onClick={() => setRoleUser(user)}
                        className={`group flex items-center justify-between w-full min-w-[120px] bg-gradient-to-r ${getRoleColors(user.role)} border rounded-lg px-3 py-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer outline-none shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                        {!isSelf && (
                          <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        )}
                      </button>
                      {isSelf && <span className="text-[8px] text-text-muted/50 italic">You cannot demote yourself</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 rounded-r-2xl text-right space-x-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="p-2 rounded-xl bg-surface-border/10 text-foreground/70 hover:bg-surface-border/20 transition-all"
                      title="View Profile"
                    >
                      <UserIcon size={18} />
                    </button>
                    {!isSelf && (
                      <button
                        onClick={() => handleDelete(user._id)}
                        disabled={loading === user._id}
                        className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground transition-all disabled:opacity-50"
                        title="Delete User"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden pb-10">
        {users.map((user) => {
          const isSelf = user.email === currentUserEmail;
          return (
            <div key={user._id} className="glass-card-no-hover p-4 animate-fade-in relative overflow-hidden group">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0" onClick={() => setSelectedUser(user)}>
                  <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700]">
                    <div className="w-full h-full rounded-full bg-background p-0.5">
                      <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border border-surface-border">
                        {user.image ? (
                          <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-foreground font-bold text-lg">{user.name?.[0]?.toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div onClick={() => setSelectedUser(user)} className="cursor-pointer">
                      <div className="flex items-center gap-2">
                        <div className="text-foreground font-bold text-base truncate group-hover:text-gold-dynamic transition-colors">{user.name}</div>
                        {isSelf && (
                          <span className="text-[8px] bg-surface-border/20 text-text-muted px-1.5 py-0.5 rounded-full uppercase font-bold tracking-tighter">You</span>
                        )}
                      </div>
                      <div className="text-gold-dynamic/70 text-xs font-bold tracking-tight">@{user.username || user.email.split('@')[0]}</div>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-text-muted uppercase font-bold tracking-wider">
                    <div className="flex items-center gap-1"><MapPin size={10} className="text-gold-dynamic/40" /> {user.panchayat || "NO PANCHAYAT"}</div>
                    <div className="flex items-center gap-1"><Hash size={10} className="text-gold-dynamic/40" /> {user.boothNumber || "NO BOOTH"}</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-surface-border flex items-center justify-between gap-4">
                <div className="flex-1">
                  <button
                    type="button"
                    disabled={loading === user._id || isSelf}
                    onClick={() => setRoleUser(user)}
                    className={`group flex items-center justify-between w-full bg-gradient-to-r ${getRoleColors(user.role)} border rounded-lg px-3 py-2 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer outline-none shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.role}</span>
                    {!isSelf && (
                      <svg className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    )}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedUser(user)}
                    className="p-3 rounded-xl bg-surface-border/10 text-foreground/70 hover:bg-surface-border/20 active:scale-95 transition-all"
                  >
                    <UserIcon size={18} />
                  </button>
                  {!isSelf && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={loading === user._id}
                      className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-foreground active:scale-95 transition-all disabled:opacity-50"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-20 text-text-muted">No members found.</div>
      )}

      {/* Profile Detail Modal (Instagram Style) */}
      {selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-lg overflow-hidden relative border-surface-border shadow-2xl">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-surface-border/10 text-text-muted hover:text-foreground hover:bg-surface-border/20 transition-all z-10"
            >
              <X size={20} />
            </button>

            {/* Modal Content */}
            <div className="p-0">
               {/* Cover/Top Header */}
               <div className="h-24 bg-gradient-to-r from-[#800000] to-[#4a0000]" />
               
               <div className="px-8 pb-8 -mt-12">
                  <div className="flex flex-col items-center text-center">
                    {/* Instagram Profile Photo */}
                    <div className="relative w-24 h-24 p-1 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700] mb-4">
                      <div className="w-full h-full rounded-full bg-background p-1">
                        <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border border-surface-border">
                          {selectedUser.image ? (
                            <img src={selectedUser.image} alt={selectedUser.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-foreground font-bold text-3xl">{selectedUser.name?.[0]?.toUpperCase()}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-foreground display-font">{selectedUser.name}</h2>
                    <p className="text-text-muted text-sm mb-4">{selectedUser.email}</p>
                    {getRoleBadge(selectedUser.role, "lg")}
                  </div>

                  {/* Details Grid */}
                  <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="glass-card-no-hover p-4 border-surface-border bg-white/2">
                        <div className="flex items-center gap-3 text-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">
                           <Phone size={12} /> Mobile
                        </div>
                        <div className="text-foreground text-sm font-medium">{selectedUser.mobile || "Not Provided"}</div>
                     </div>
                     <div className="glass-card-no-hover p-4 border-surface-border bg-white/2">
                        <div className="flex items-center gap-3 text-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">
                           <CreditCard size={12} /> Voter ID
                        </div>
                        <div className="text-foreground text-sm font-medium">{selectedUser.voterId || "Not Linked"}</div>
                     </div>
                     <div className="glass-card-no-hover p-4 border-surface-border bg-white/2">
                        <div className="flex items-center gap-3 text-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">
                           <MapPin size={12} /> Panchayat
                        </div>
                        <div className="text-foreground text-sm font-medium">{selectedUser.panchayat || "Not Set"}</div>
                     </div>
                     <div className="glass-card-no-hover p-4 border-surface-border bg-white/2">
                        <div className="flex items-center gap-3 text-text-muted text-[10px] uppercase font-bold tracking-widest mb-1">
                           <Hash size={12} /> Booth
                        </div>
                        <div className="text-foreground text-sm font-medium">{selectedUser.boothNumber || "Not Assigned"}</div>
                     </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between text-[10px] text-text-muted/50 uppercase font-bold border-t border-surface-border pt-4">
                     <div className="flex items-center gap-1">
                        <Calendar size={10} /> Joined: {new Date(selectedUser.createdAt).toLocaleDateString()}
                     </div>
                     <div>ID: {selectedUser._id.substring(0, 8)}...</div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
      {/* Role Selection Modal */}
      {roleUser && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl animate-fade-in">
          <div className="glass-card w-full max-w-sm overflow-hidden relative border-surface-border shadow-2xl">
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#FFD700] animate-pulse" />
                  <h3 className="text-foreground text-[10px] font-black uppercase tracking-[0.3em]">Change Designation</h3>
                </div>
                <button onClick={() => setRoleUser(null)} className="text-text-muted hover:text-foreground transition-colors p-2 -mr-2"><X size={20} /></button>
              </div>

              {/* Targeted User Info */}
              <div className="flex flex-col items-center mb-10">
                 <div className="w-20 h-20 rounded-full p-1 bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700] mb-4 shadow-2xl shadow-[#FFD700]/10">
                    <div className="w-full h-full rounded-full bg-background p-1">
                       <div className="w-full h-full rounded-full bg-surface flex items-center justify-center overflow-hidden border border-surface-border">
                          {roleUser.image ? (
                             <img src={roleUser.image} alt={roleUser.name} className="w-full h-full object-cover" />
                          ) : (
                             <span className="text-foreground font-bold text-2xl">{roleUser.name?.[0]?.toUpperCase()}</span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="text-foreground font-black text-lg tracking-tight leading-none mb-1">{roleUser.name}</div>
                 <div className="text-gold-dynamic text-xs font-bold uppercase tracking-widest opacity-80">@{roleUser.username || roleUser.email.split('@')[0]}</div>
              </div>
              
              <div className="space-y-3">
                {["Voter", "Poruppalar", "MLA", "DistSecretary", "Admin"].map((role) => {
                  const isSelected = roleUser.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => {
                        handleRoleChange(roleUser._id, role);
                        setRoleUser(null);
                      }}
                      className={`w-full group relative overflow-hidden rounded-2xl transition-all duration-300 active:scale-[0.98] border
                        ${isSelected 
                          ? `bg-gradient-to-r ${getRoleColors(role)} shadow-lg border-white/20` 
                          : 'bg-surface-border/10 text-text-muted hover:bg-surface-border/20 hover:text-foreground border-surface-border hover:border-surface-border'}
                      `}
                    >
                      <div className="px-5 py-4 flex items-center justify-between relative z-10">
                        <span className={`text-[11px] font-black uppercase tracking-[0.15em] ${isSelected ? '' : 'group-hover:tracking-[0.2em] transition-all'}`}>
                          {role}
                        </span>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                             <span className="text-[8px] font-black uppercase opacity-60">Active</span>
                             <div className="w-2 h-2 rounded-full bg-current animate-pulse" />
                          </div>
                        )}
                      </div>
                      {!isSelected && (
                        <div className={`absolute inset-0 bg-gradient-to-r ${getRoleColors(role)} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      )}
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={() => setRoleUser(null)}
                className="mt-8 w-full py-2 text-[10px] font-black text-text-muted/50 uppercase tracking-[0.2em] hover:text-gold-dynamic transition-all"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Pagination Controls */}
      <div className="mt-10 flex items-center justify-between border-t border-surface-border pt-6">
        <div className="text-xs text-text-muted font-medium">
          Showing page <span className="text-foreground font-bold">{pagination.currentPage}</span> of <span className="text-foreground font-bold">{pagination.totalPages}</span>
        </div>
        <div className="flex gap-2">
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => handlePageChange(pagination.currentPage - 1)}
            className="btn-secondary py-2 px-4 text-[10px] disabled:opacity-30 uppercase font-black tracking-widest"
          >
            Previous
          </button>
          <button
            disabled={pagination.currentPage >= pagination.totalPages}
            onClick={() => handlePageChange(pagination.currentPage + 1)}
            className="btn-primary py-2 px-4 text-[10px] disabled:opacity-30 uppercase font-black tracking-widest"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
