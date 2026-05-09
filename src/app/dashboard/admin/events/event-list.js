"use client";

import { useState } from "react";
import { createEvent, deleteEvent, toggleEventStatus } from "@/actions/event";
import { Calendar, MapPin, Plus, Trash2, Power, X, Loader2 } from "lucide-react";

export default function EventList({ initialEvents }) {
  const [events, setEvents] = useState(initialEvents);
  const [showModal, setShowModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.target);
    const res = await createEvent(formData);
    if (res.success) {
      setShowModal(false);
      window.location.reload();
    } else {
      alert(res.error);
    }
    setIsPending(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this event? All attendance records for this event will remain but won't be linked to a current event.")) return;
    const res = await deleteEvent(id);
    if (res.success) {
      setEvents(events.filter(e => e._id !== id));
    }
  };

  const handleToggle = async (id, status) => {
    const res = await toggleEventStatus(id, status);
    if (res.success) {
      setEvents(events.map(e => e._id === id ? { ...e, isActive: !status } : e));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center gap-2 py-2.5 px-6"
        >
          <Plus size={18} /> Create New Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length > 0 ? events.map((e) => (
          <div key={e._id} className={`glass-card p-6 border-white/5 relative group transition-all ${!e.isActive ? "opacity-60 grayscale" : ""}`}>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white tracking-tight">{e.title}</h3>
                <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border ${e.isActive ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}>
                  {e.isActive ? "Active" : "Closed"}
                </div>
              </div>
              
              <p className="text-white/60 text-sm line-clamp-2">{e.description}</p>
              
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-white/40">
                  <Calendar size={14} className="text-[#FFD700]" />
                  <span className="text-xs font-bold">{new Date(e.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <MapPin size={14} className="text-[#FFD700]" />
                  <span className="text-xs font-bold truncate">{e.location || "Online"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button 
                  onClick={() => handleToggle(e._id, e.isActive)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${e.isActive ? "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20" : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"}`}
                >
                  <Power size={12} /> {e.isActive ? "Close Event" : "Reopen Event"}
                </button>
                <button 
                  onClick={() => handleDelete(e._id)}
                  className="p-2 text-white/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl border border-white/5 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )) : (
          <div className="col-span-full glass-card p-20 text-center border-dashed border-white/10 bg-transparent">
            <Calendar size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/30 uppercase font-black tracking-widest text-xs">No events scheduled</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-card w-full max-w-md p-8 border-white/10 shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-white/20 hover:text-white">
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-tight">Schedule Event</h2>
            
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Event Title</label>
                <input name="title" required className="input-dark" placeholder="e.g. General Body Meeting" />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Description</label>
                <textarea name="description" className="input-dark min-h-[80px]" placeholder="What is this event about?" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Date</label>
                  <input name="date" type="date" required className="input-dark" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-white/40 ml-1">Location</label>
                  <input name="location" className="input-dark" placeholder="e.g. Town Hall" />
                </div>
              </div>
              
              <button disabled={isPending} type="submit" className="btn-primary w-full mt-4 flex items-center justify-center gap-2">
                {isPending ? <Loader2 className="animate-spin" size={18} /> : "Create Event"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
