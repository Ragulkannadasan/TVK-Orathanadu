"use client";

import { useState } from "react";
import { registerForEvent } from "@/actions/event";
import { Calendar, MapPin, Loader2, CheckCircle2 } from "lucide-react";

export default function UserEventList({ initialEvents, initialBookings }) {
  const [loadingId, setLoadingId] = useState(null);
  const [bookings, setBookings] = useState(initialBookings);

  const handleRegister = async (eventId) => {
    setLoadingId(eventId);
    const res = await registerForEvent(eventId);
    if (res.success) {
      // Optimistic update - in real app we might refetch
      window.location.reload();
    } else {
      alert(res.error);
    }
    setLoadingId(null);
  };

  const isRegistered = (eventId) => {
    return bookings.some(b => b.eventId?._id === eventId || b.eventId === eventId);
  };

  const getSeat = (eventId) => {
    const b = bookings.find(b => b.eventId?._id === eventId || b.eventId === eventId);
    return b?.seatNumber;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {initialEvents.filter(e => e.isActive).length > 0 ? initialEvents.filter(e => e.isActive).map((e) => (
        <div key={e._id} className="glass-card p-6 border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">{e.title}</h3>
            {isRegistered(e._id) && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 text-[8px] font-black uppercase tracking-widest">
                <CheckCircle2 size={10} /> Confirmed
              </div>
            )}
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

          <div className="pt-2">
            {isRegistered(e._id) ? (
              <div className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-[7px] uppercase font-black text-white/20 tracking-widest leading-none mb-1">Your Assigned Seat</span>
                <span className="text-lg font-black text-[#FFD700] tracking-tighter">{getSeat(e._id)}</span>
              </div>
            ) : (
              <button 
                onClick={() => handleRegister(e._id)}
                disabled={loadingId === e._id}
                className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 uppercase tracking-widest font-black text-xs"
              >
                {loadingId === e._id ? <Loader2 className="animate-spin" size={18} /> : "Reserve My Seat"}
              </button>
            )}
          </div>
        </div>
      )) : (
        <div className="col-span-full glass-card p-20 text-center border-dashed border-white/10 bg-transparent">
          <Calendar size={48} className="mx-auto text-white/10 mb-4" />
          <p className="text-white/30 uppercase font-black tracking-widest text-xs">No active events to join</p>
        </div>
      )}
    </div>
  );
}
