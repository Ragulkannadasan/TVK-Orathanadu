"use client";

import { useCallback, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Loader2 } from "lucide-react";

export default function MembershipCard({ user }) {
  const cardRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "TV";

  const handleDownload = useCallback(async () => {
    if (cardRef.current === null) return;
    setIsDownloading(true);

    try {
      // Small delay to ensure all styles/images are fully painted
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true, 
        pixelRatio: 2,
        backgroundColor: '#080808' // Match background
      });

      const link = document.createElement("a");
      link.download = `TVK_ID_${user.name?.replace(/\s+/g, "_") || "Member"}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Error downloading card:", err);
      alert("Please try taking a screenshot instead if the download fails.");
    } finally {
      setIsDownloading(false);
    }
  }, [cardRef, user.name]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div 
        ref={cardRef}
        className="relative w-full max-w-sm rounded-2xl overflow-hidden glow-maroon"
        style={{
          background: "linear-gradient(135deg, var(--color-maroon) 0%, var(--color-maroon-dark) 50%, var(--color-maroon) 100%)",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)",
        }}>
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,215,0,0.3) 20px, rgba(255,215,0,0.3) 21px)",
          }}
        />
        {/* Decorative circles */}
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-[#FFD700]/10 animate-glow-pulse" />
        <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full bg-[#FFD700]/5 animate-glow-pulse" style={{ animationDelay: "1.5s" }} />

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-[#FFD700] font-bold text-lg leading-tight tamil display-font">தமிழக வெற்றி கழகம்</h2>
              <p className="text-white/70 text-xs mt-0.5">Thamizhaga Vetri Kazhagam</p>
            </div>
            <div className="text-right">
              <p className="text-[#FFD700]/80 text-[10px] uppercase tracking-wider">Digital ID</p>
              <p className="text-white/60 text-xs">Orathanadu 175</p>
            </div>
          </div>

          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700]/50 flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-[#FFD700] font-bold text-2xl">{initials}</span>
              )}
            </div>
            <div>
              <h3 className="text-white font-bold text-xl">{user?.name || "TVK Member"}</h3>
              <p className="text-white/60 text-sm">{user?.email}</p>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <InfoBlock label="Voter ID" value={user?.voterId || "Not Set"} />
            <InfoBlock label="Booth No." value={user?.boothNumber ? `#${user.boothNumber}` : "N/A"} />
            <InfoBlock label="Panchayat" value={user?.panchayat || "Not Set"} />
            <InfoBlock label="Mobile" value={user?.phone || user?.mobile || "Not Set"} />
          </div>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-white/20 flex items-center justify-between">
            <p className="text-[#FFD700]/70 text-[10px] italic tamil">"பிறப்பொக்கும் எல்லா உயிர்க்கும்"</p>
            <div className="flex gap-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#FFD700]/30" />
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center justify-center gap-2 w-full max-w-sm mx-auto px-6 py-3 rounded-xl bg-[#FFD700] text-black font-black text-sm uppercase tracking-widest hover:bg-white transition-all shadow-[0_10px_20px_rgba(255,215,0,0.2)] disabled:opacity-50"
      >
        {isDownloading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : (
          <Download size={18} />
        )}
        <span>{isDownloading ? "Downloading..." : "Download Digital Card"}</span>
      </button>
    </div>
  );
}

function InfoBlock({ label, value }) {
  return (
    <div className="bg-black/20 rounded-lg p-3">
      <p className="text-[#FFD700]/60 text-[10px] uppercase tracking-wider">{label}</p>
      <p className="text-white font-semibold text-sm mt-0.5 truncate">{value}</p>
    </div>
  );
}
