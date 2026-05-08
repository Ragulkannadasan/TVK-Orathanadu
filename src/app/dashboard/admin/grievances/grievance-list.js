"use client";

import { useState } from "react";
import { updateGrievanceStatus, deleteGrievance } from "@/actions/admin";
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  MoreVertical, 
  Trash2, 
  User as UserIcon,
  MapPin,
  Calendar,
  Filter
} from "lucide-react";

export default function GrievanceList({ initialGrievances }) {
  const [grievances, setGrievances] = useState(initialGrievances);
  const [loading, setLoading] = useState(null);
  const [filter, setFilter] = useState("All");

  const handleStatusUpdate = async (id, status) => {
    setLoading(id);
    const res = await updateGrievanceStatus(id, status);
    if (res.success) {
      setGrievances(grievances.map(g => g._id === id ? { ...g, status } : g));
    } else {
      alert(res.error || "Failed to update status");
    }
    setLoading(null);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this grievance?")) return;
    setLoading(id);
    const res = await deleteGrievance(id);
    if (res.success) {
      setGrievances(grievances.filter(g => g._id !== id));
    } else {
      alert(res.error || "Failed to delete");
    }
    setLoading(null);
  };

  const filteredGrievances = grievances.filter(g => 
    filter === "All" || g.status === filter
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={16} className="text-white/20 shrink-0" />
        {["All", "Pending", "Investigating", "Resolved"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border
              ${filter === f 
                ? "bg-[#FFD700] text-black border-[#FFD700]" 
                : "bg-white/5 text-white/40 border-white/5 hover:bg-white/10"}`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredGrievances.length === 0 ? (
          <div className="glass-card p-20 text-center text-white/20 italic uppercase text-xs font-bold tracking-[0.2em]">
            No grievances found for {filter}
          </div>
        ) : (
          filteredGrievances.map((g) => (
            <div key={g._id} className="glass-card p-6 border-white/5 group hover:border-[#800000]/30 transition-all">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                
                {/* Left Side: Content */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-[#800000]/20 text-[#FFD700] uppercase font-black tracking-widest border border-[#800000]/30">
                      {g.category}
                    </span>
                    <StatusBadge status={g.status} />
                  </div>

                  <div>
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#FFD700] transition-colors">{g.title}</h3>
                    <p className="text-white/50 text-sm leading-relaxed max-w-3xl">{g.description}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/30 uppercase font-bold tracking-widest pt-2">
                    <div className="flex items-center gap-1.5"><UserIcon size={12} className="text-[#FFD700]/40" /> {g.userId?.name || "Deleted User"}</div>
                    <div className="flex items-center gap-1.5"><MapPin size={12} className="text-[#FFD700]/40" /> {g.panchayat || "Unknown"} · {g.boothNumber || "Booth N/A"}</div>
                    <div className="flex items-center gap-1.5"><Calendar size={12} className="text-[#FFD700]/40" /> {new Date(g.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>

                {/* Right Side: Actions */}
                <div className="flex items-center md:flex-col gap-3 justify-between md:justify-start">
                   <div className="flex items-center gap-2">
                      <select
                        value={g.status}
                        disabled={loading === g._id}
                        onChange={(e) => handleStatusUpdate(g._id, e.target.value)}
                        className="bg-black/40 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl focus:outline-none focus:border-[#FFD700] transition-all cursor-pointer"
                      >
                        <option value="Pending">Mark Pending</option>
                        <option value="Investigating">Mark Investigating</option>
                        <option value="Resolved">Mark Resolved</option>
                      </select>
                      
                      <button
                        onClick={() => handleDelete(g._id)}
                        disabled={loading === g._id}
                        className="p-2.5 rounded-xl bg-red-500/5 text-red-500/50 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>
                   </div>
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Pending: { icon: Clock, color: "text-amber-400 bg-amber-400/10 border-amber-400/20" },
    Investigating: { icon: AlertCircle, color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    Resolved: { icon: CheckCircle, color: "text-green-400 bg-green-400/10 border-green-500/20" },
  };
  const { icon: Icon, color } = config[status] || config.Pending;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${color}`}>
      <Icon size={10} />
      {status}
    </div>
  );
}
