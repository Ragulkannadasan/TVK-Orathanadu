"use client";

import { useSession } from "next-auth/react";
import { User, Bell } from "lucide-react";
import Link from "next/link";
import InstallButton from "@/components/InstallButton";
import ThemeToggle from "./ThemeToggle";

export default function MobileHeader({ user }) {

  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-background/80 backdrop-blur-xl border-b border-surface-border px-4 py-3 flex items-center justify-between shadow-lg transition-colors">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 flex items-center justify-center overflow-hidden bg-transparent rounded-lg p-0.5">
          <img src="/icon.png" alt="TVK" className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-foreground font-black text-sm display-font tracking-tight leading-none">
            {user?.name || "TVK Member"}
          </span>
          <span className="text-maroon dark:text-gold text-[8px] font-black uppercase tracking-[0.2em] mt-0.5">
            Orathanadu
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link href="/dashboard/notifications" className="w-8 h-8 rounded-full bg-surface-border/10 border border-surface-border flex items-center justify-center text-text-muted hover:text-gold-dynamic transition-colors relative">
          <Bell size={16} />
          <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#FFD700] rounded-full animate-pulse shadow-[0_0_5px_#FFD700]" />
        </Link>
        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-surface border border-surface-border flex items-center justify-center text-gold-dynamic overflow-hidden transition-transform active:scale-90 shadow-sm">
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
