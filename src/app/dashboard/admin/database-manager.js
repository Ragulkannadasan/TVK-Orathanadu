"use client";

import { useState, useEffect } from "react";
import { getDatabaseStats, clearOldMessages, clearResolvedGrievances } from "@/actions/db-admin";
import { Database, Trash2, HardDrive, RefreshCw } from "lucide-react";

export default function DatabaseManager() {
  const [stats, setStats] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const fetchStats = async () => {
    const data = await getDatabaseStats();
    setStats(data);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleClearMessages = async () => {
    if (!confirm("Are you sure? This will delete all chat messages older than 30 days.")) return;
    setIsPending(true);
    const res = await clearOldMessages(30);
    if (res.success) {
      alert(`Deleted ${res.deletedCount} old messages.`);
      fetchStats();
    }
    setIsPending(false);
  };

  const handleClearGrievances = async () => {
    if (!confirm("Are you sure? This will permanently delete all RESOLVED grievances.")) return;
    setIsPending(true);
    const res = await clearResolvedGrievances();
    if (res.success) {
      alert(`Deleted ${res.deletedCount} resolved grievances.`);
      fetchStats();
    }
    setIsPending(false);
  };

  if (!stats) return (
    <div className="glass-card p-6 border-white/5 animate-pulse">
      <div className="h-4 w-32 bg-white/10 rounded mb-4" />
      <div className="h-10 w-full bg-white/5 rounded" />
    </div>
  );

  const usagePercent = Math.min((stats.totalSize / stats.limitMB) * 100, 100);
  const isHighUsage = usagePercent > 80;

  return (
    <div className="glass-card p-6 border-white/5 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-white font-bold flex items-center gap-2">
          <Database size={18} className="text-[#FFD700]" /> Storage Management
        </h3>
        <button 
          onClick={fetchStats}
          className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-[#FFD700] transition-all"
        >
          <RefreshCw size={14} className={isPending ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-end mb-2">
          <div className="flex items-center gap-2">
            <HardDrive size={14} className={isHighUsage ? "text-red-500" : "text-white/40"} />
            <span className="text-white/60 text-[10px] font-black uppercase tracking-widest">Global Usage</span>
          </div>
          <span className={`text-sm font-black ${isHighUsage ? "text-red-500" : "text-white"}`}>
            {stats.totalSize} MB / {stats.limitMB} MB
          </span>
        </div>
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ${isHighUsage ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-gradient-to-r from-[#800000] to-[#FFD700]"}`}
            style={{ width: `${usagePercent}%` }}
          />
        </div>
      </div>

      {/* Breakdown List */}
      <div className="space-y-4 mb-8">
        {stats.breakdown.map((item) => (
          <div key={item.label} className="group">
            <div className="flex justify-between items-center mb-1.5">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xs">{item.label}</span>
                <span className="text-white/20 text-[9px] font-bold uppercase tracking-tight">({item.count} items)</span>
              </div>
              <div className="text-right">
                <span className="text-white text-xs font-mono">{item.size} MB</span>
                <span className="text-[#FFD700] text-[10px] font-black ml-2">{item.percent}%</span>
              </div>
            </div>
            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white/10 group-hover:bg-[#FFD700]/40 transition-all duration-500" 
                style={{ width: `${item.percent}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={handleClearMessages}
          disabled={isPending}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
        >
          <Trash2 size={20} className="text-white/20 group-hover:text-red-500 mb-2 transition-colors" />
          <span className="text-white/80 text-xs font-bold">Clear Old Chats</span>
          <span className="text-white/20 text-[8px] uppercase mt-1">Older than 30 days</span>
        </button>

        <button
          onClick={handleClearGrievances}
          disabled={isPending}
          className="flex flex-col items-center justify-center p-4 rounded-xl bg-white/2 border border-white/5 hover:border-red-500/30 hover:bg-red-500/5 transition-all group"
        >
          <Trash2 size={20} className="text-white/20 group-hover:text-red-500 mb-2 transition-colors" />
          <span className="text-white/80 text-xs font-bold">Purge Grievances</span>
          <span className="text-white/20 text-[8px] uppercase mt-1">{stats.resolvedCount} Resolved issues</span>
        </button>
      </div>

      <p className="mt-6 text-[9px] text-white/20 uppercase font-bold tracking-[0.2em] text-center italic">
        Database maintenance is critical for 512MB quotas
      </p>
    </div>
  );
}
