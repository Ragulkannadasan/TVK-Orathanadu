"use client";

import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import Link from "next/link";
import InstallButton from "@/components/InstallButton";

export default function MobileHeader() {

  const { data: session } = useSession();

  return (
    <header className="md:hidden sticky top-0 z-40 w-full bg-[#080808]/80 backdrop-blur-xl border-b border-white/10 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#800000] flex items-center justify-center glow-maroon border border-[#FFD700]/20">
          <span className="text-[#FFD700] font-bold text-[10px]">TVK</span>
        </div>
        <span className="text-white font-bold text-sm display-font tracking-tight">Orathanadu</span>
      </div>
      
      <div className="flex items-center gap-3">
        <InstallButton />
        <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#FFD700]">
          <User size={16} />
        </Link>
      </div>


    </header>
  );
}
