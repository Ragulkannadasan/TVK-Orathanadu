"use client";

import { QRCodeSVG } from "qrcode.react";
import { User, Calendar, MapPin, ShieldCheck } from "lucide-react";

export default function DigitalTicket({ user, bookings = [] }) {
  if (!user) return null;

  const latestBooking = bookings[0]; // Assume first one is the most relevant for now

  // The QR data will be the User ID for verification
  const qrData = JSON.stringify({
    type: "TVK_VERIFY",
    id: user.id || user._id,
    name: user.name,
    role: user.role,
    bookingId: latestBooking?._id,
    seat: latestBooking?.seatNumber,
    event: latestBooking?.eventId?.title
  });

  return (
    <div className="max-w-sm mx-auto animate-fade-in-up">
      <div className="glass-card overflow-hidden border-white/10 shadow-2xl relative">
        {/* Top Section - Brand */}
        <div className="bg-[#800000] p-4 flex items-center justify-between border-b border-[#FFD700]/20">
          <div className="flex items-center gap-2">
            <img src="/icon.png" alt="TVK" className="w-8 h-8" />
            <div className="flex flex-col">
              <span className="text-white font-black text-xs uppercase tracking-tighter leading-none">TVK Orathanadu</span>
              <span className="text-[#FFD700] text-[8px] font-black uppercase tracking-widest mt-1">Digital Identity</span>
            </div>
          </div>
          <div className="p-1.5 rounded-lg bg-black/20 border border-white/10">
            <ShieldCheck size={14} className="text-[#FFD700]" />
          </div>
        </div>

        {/* Middle Section - QR Code */}
        <div className="p-8 flex flex-col items-center bg-gradient-to-b from-[#0a0a0a] to-[#050505]">
          <div className="p-4 bg-white rounded-2xl shadow-[0_0_50px_rgba(255,215,0,0.15)] mb-6">
            <QRCodeSVG 
              value={qrData} 
              size={180}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/icon.png",
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{user.name}</h2>
          <p className="text-[#FFD700] text-[10px] font-black uppercase tracking-[0.3em] mb-4">{user.role}</p>
          
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="flex flex-col gap-1">
              <span className="text-[8px] uppercase font-black text-white/30 tracking-widest">Booth Number</span>
              <span className="text-xs font-bold text-white">{user.boothNumber || "Not Set"}</span>
            </div>
            <div className="flex flex-col gap-1 text-right">
              <span className="text-[8px] uppercase font-black text-white/30 tracking-widest">Panchayat</span>
              <span className="text-xs font-bold text-white truncate">{user.panchayat || "Not Set"}</span>
            </div>
          </div>

          {latestBooking && (
            <div className="w-full mt-6 p-3 rounded-xl bg-[#FFD700]/5 border border-[#FFD700]/10 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[7px] uppercase font-black text-[#FFD700]/40 tracking-widest leading-none mb-1">Active Event</span>
                <span className="text-[10px] font-bold text-white truncate max-w-[150px]">{latestBooking.eventId?.title}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[7px] uppercase font-black text-[#FFD700]/40 tracking-widest leading-none mb-1">Seat Number</span>
                <span className="text-sm font-black text-[#FFD700] leading-none">{latestBooking.seatNumber}</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section - Footer */}
        <div className="p-4 bg-[#0a0a0a] border-t border-dashed border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/40">
            <Calendar size={12} />
            <span className="text-[10px] font-bold">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-white/40">
            <MapPin size={12} />
            <span className="text-[10px] font-bold">Orathanadu 175</span>
          </div>
        </div>
        
        {/* Decorative Ticket Notches */}
        <div className="absolute left-0 top-[60%] -translate-y-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#080808]" />
        <div className="absolute right-0 top-[60%] -translate-y-1/2 translate-x-1/2 w-6 h-6 rounded-full bg-[#080808]" />
      </div>
      
      <p className="text-center mt-4 text-[10px] text-white/20 uppercase font-black tracking-widest">
        Show this QR code at event entrances for verification
      </p>
    </div>
  );
}
