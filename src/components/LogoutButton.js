"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export default function LogoutButton({ className }) {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className={`flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all duration-300 font-bold text-sm ${className}`}
    >
      <LogOut size={18} />
      <span>கணக்கிலிருந்து வெளியேறு / Logout</span>
    </button>
  );
}
