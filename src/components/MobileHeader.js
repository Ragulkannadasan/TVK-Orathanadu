"use client";

import { useSession } from "next-auth/react";
import { User, Bell } from "lucide-react";
import Link from "next/link";
import InstallButton from "@/components/InstallButton";

export default function MobileHeader({ user }) {

  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-[#080808]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden">
          <img src="/icon.png" alt="TVK" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-white font-black text-sm display-font tracking-tight leading-none">
            {user?.name || "TVK Member"}
          </span>
          <span className="text-[#FFD700] text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">
            Orathanadu
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <InstallButton />
        <Link href="/dashboard/notifications" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-[#FFD700] transition-colors relative">
          <Bell size={16} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-pulse shadow-[0_0_5px_#FFD700]" />
        </Link>
        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-[#FFD700] overflow-hidden transition-transform active:scale-90">
          {user?.image ? (
            <img src={user.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <User size={16} />
          )}
        </Link>
      </div>


    </header>
  );
}
