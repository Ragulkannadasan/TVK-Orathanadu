"use client";

import { useState } from "react";
import { createNotification, deleteNotification } from "@/actions/notification";
import { Bell, Megaphone, Shield, Trash2, Plus, X, Info, AlertTriangle, CheckCircle } from "lucide-react";

export default function NotificationList({ initialNotifications, isAdmin }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showModal, setShowModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'announcement': return <Megaphone className="text-gold-dynamic" size={18} />;
      case 'warning': return <AlertTriangle className="text-red-400" size={18} />;
      case 'success': return <CheckCircle className="text-green-400" size={18} />;
      default: return <Info className="text-blue-400" size={18} />;
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target);
    const res = await createNotification(formData);
    if (res.success) {
      setShowModal(false);
      window.location.reload(); // Simple refresh to show new notification
    } else {
      alert(res.error);
    }
    setIsPending(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this notification?")) return;
    const res = await deleteNotification(id);
    if (res.success) {
      setNotifications(notifications.filter(n => n._id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex justify-end">
          <button 
            onClick={() => setShowModal(true)}
            className="btn-primary flex items-center gap-2 py-2 px-6"
          >
            <Plus size={18} /> Broadcast Message
          </button>
        </div>
      )}

      {/* Notification List */}
      <div className="grid grid-cols-1 gap-4">
        {notifications.length > 0 ? notifications.map((n) => (
          <div key={n._id} className="glass-card p-5 border-surface-border relative group animate-fade-in">
            <div className="flex gap-4">
              <div className="mt-1 p-2 rounded-xl bg-surface-border/10 border border-surface-border shrink-0 h-fit">
                {getTypeIcon(n.type)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-foreground font-bold tracking-tight">{n.title}</h3>
                  <span className="text-[10px] text-text-muted/50 font-mono uppercase">
                    {new Date(n.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-text-muted text-sm leading-relaxed mb-3">{n.message}</p>
                <div className="flex items-center gap-3">
                  <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-surface-border/10 text-text-muted border border-surface-border">
                    Target: {n.targetRole}
                  </span>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <button 
                onClick={() => handleDelete(n._id)}
                className="absolute top-4 right-4 p-2 text-foreground/10 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        )) : (
          <div className="glass-card p-20 text-center border-dashed border-surface-border bg-transparent">
            <Bell size={48} className="mx-auto text-foreground/10 mb-4" />
            <p className="text-text-muted uppercase font-black tracking-widest text-xs">No notifications yet</p>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 border-surface-border shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-text-muted/50 hover:text-foreground">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Megaphone className="text-gold-dynamic" /> Create Broadcast
            </h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Title</label>
                <input name="title" required className="input-dark" placeholder="Important Announcement" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Message</label>
                <textarea name="message" required className="input-dark min-h-[100px] py-3" placeholder="Write your message here..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Type</label>
                  <select name="type" className="input-dark bg-black/40">
                    <option value="announcement">Announcement</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-text-muted ml-1">Target</label>
                  <select name="targetRole" className="input-dark bg-black/40">
                    <option value="All">Everyone</option>
                    <option value="Voter">Voters Only</option>
                    <option value="Poruppalar">Leaders Only</option>
                    <option value="Admin">Admins Only</option>
                  </select>
                </div>
              </div>
              
              <button disabled={isPending} type="submit" className="btn-primary w-full mt-4">
                {isPending ? "Broadcasting..." : "Send Notification"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
