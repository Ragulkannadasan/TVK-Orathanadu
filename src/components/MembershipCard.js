"use client";

export default function MembershipCard({ user }) {
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "TV";

  return (
    <div className="relative w-full max-w-sm rounded-2xl overflow-hidden glow-maroon"
      style={{
        background: "linear-gradient(135deg, var(--color-maroon) 0%, var(--color-maroon-dark) 50%, var(--color-maroon) 100%)",
        boxShadow: "0 20px 60px rgba(128, 0, 0, 0.5)",
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
          <div className="w-16 h-16 rounded-full bg-[#FFD700]/20 border-2 border-[#FFD700]/50 flex items-center justify-center">
            <span className="text-[#FFD700] font-bold text-2xl">{initials}</span>
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
