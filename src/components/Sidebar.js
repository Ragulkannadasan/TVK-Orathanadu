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
import ThemeToggle from "./ThemeToggle";



const roleColors = {
  Admin: { bg: "bg-purple-500/20", text: "text-purple-400", icon: Shield },
  Poruppalar: { bg: "bg-blue-500/20", text: "text-blue-400", icon: Star },
  Voter: { bg: "bg-green-500/20", text: "text-green-400", icon: Users },
};

export default function Sidebar({ user: initialUser }) {
  const { data: session } = useSession();
  const user = initialUser || session?.user;
  const pathname = usePathname();
  const role = user?.role || "Voter";
  const items = navItems[role] || navItems.Voter;
  const roleStyle = roleColors[role] || roleColors.Voter;
  const RoleIcon = roleStyle.icon;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface dark:bg-background/80 backdrop-blur-xl border-r border-surface-border sticky top-0 h-screen z-30 transition-colors shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Logo */}
      <div className="p-6 border-b border-surface-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center overflow-hidden p-0.5">
            <img src="/icon.png" alt="TVK" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="text-foreground font-bold text-sm">TVK 175</p>
            <p className="text-text-muted text-[10px] font-black uppercase tracking-widest">ஒரத்தநாடு</p>
          </div>
        </div>
        <ThemeToggle />
      </div>

      {/* User info */}
      {user && (
        <div 
          className="p-4 mx-3 mt-4 rounded-xl border border-surface-border shadow-sm transition-colors"
          style={{ backgroundColor: 'var(--surface)' }}
        >
          <p className="text-foreground text-sm font-semibold truncate">{user.name || "Member"}</p>
          <p className="text-text-muted text-[10px] truncate mt-0.5 font-medium">{user.email}</p>
          <div className={`inline-flex items-center gap-1 mt-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${roleStyle.bg} ${roleStyle.text} border border-current/10`}>
            <RoleIcon size={9} />
            {role}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 p-3 mt-4 space-y-1 overflow-y-auto">
        {items.map(({ href, label, labelTa, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                active
                  ? "bg-maroon text-gold"
                  : "text-text-muted hover:bg-black/5 dark:hover:bg-surface-border/10 hover:text-foreground"
              }`}
            >
              <Icon size={18} className={active ? "text-gold" : "group-hover:text-foreground"} />
              <div>
                <p className="text-sm font-medium leading-none">{label}</p>
                <p className="text-[10px] mt-1 opacity-50 tamil">{labelTa}</p>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-[#222]">
        <InstallButton />
      </div>
    </aside>
  );
}
