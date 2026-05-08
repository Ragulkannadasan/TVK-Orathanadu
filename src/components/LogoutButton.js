"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton({ className }) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 font-bold text-sm disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" />
      ) : (
        <LogOut size={18} />
      )}
      <span>{loading ? "வெளியேறுகிறது..." : "கணக்கிலிருந்து வெளியேறு / Logout"}</span>
    </button>
  );
}
