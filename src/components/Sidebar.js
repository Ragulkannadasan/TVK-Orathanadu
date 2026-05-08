"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import InstallButton from "@/components/InstallButton";
import {
  Shield,
  Star,
  Users,
} from "lucide-react";



const roleColors = {
  Admin: { bg: "bg-purple-500/20", text: "text-purple-400", icon: Shield },
  Poruppalar: { bg: "bg-blue-500/20", text: "text-blue-400", icon: Star },
  Voter: { bg: "bg-green-500/20", text: "text-green-400", icon: Users },
};

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role || "Voter";
  const items = navItems[role] || navItems.Voter;
  const roleStyle = roleColors[role] || roleColors.Voter;
  const RoleIcon = roleStyle.icon;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-[#080808]/80 backdrop-blur-xl border-r border-white/10 sticky top-0 h-screen z-30">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#800000] flex items-center justify-center glow-maroon">
            <span className="text-[#FFD700] font-bold text-sm">TVK</span>
          </div>
          <div>
            <p className="text-white font-bold text-sm">TVK Orathanadu</p>
            <p className="text-[#a0a0a0] text-xs">தொகுதி 175</p>
          </div>
        </div>
      </div>

      {/* User info */}
      {session?.user && (
        <div className="p-4 mx-3 mt-4 rounded-xl glass">
          <p className="text-white text-sm font-semibold truncate">{session.user.name || "Member"}</p>
          <p className="text-[#a0a0a0] text-xs truncate mt-0.5">{session.user.email}</p>
          <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${roleStyle.bg} ${roleStyle.text}`}>
            <RoleIcon size={10} />
            {role}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 mt-4 space-y-1">
        {items.map(({ href, label, labelTa, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                active
                  ? "bg-[#800000] text-[#FFD700] shadow-lg shadow-red-900/30"
                  : "text-[#a0a0a0] hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon size={18} className={active ? "text-[#FFD700]" : "group-hover:text-white"} />
              <div>
                <p className="text-sm font-medium leading-none">{label}</p>
                <p className="text-[10px] mt-0.5 opacity-70 tamil">{labelTa}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <InstallButton />
      </div>
    </aside>

  );
}
