"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { useState, useEffect } from "react";

export default function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState(null);

  // Clear pending state when we successfully navigate
  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  const role = session?.user?.role || "Voter";
  const items = (navItems[role] || navItems.Voter).filter(item => item.href !== "/dashboard/notifications");

  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-50">
      <nav className="bg-[#0a0a0a] px-2 py-3 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl overflow-hidden relative">
        {/* Background glow for the whole bar */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/10 to-transparent -z-10" />
        
        {items.slice(0, 5).map(({ href, label, labelTa, icon: Icon }) => {
          const active = pathname === href || pendingHref === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                if (href !== pathname) setPendingHref(href);
              }}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative ${
                active ? "text-[#FFD700] scale-110" : "text-[#a0a0a0] hover:text-white"
              }`}
            >
              {active && (
                <div className="absolute -top-3 w-1 h-1 bg-[#FFD700] rounded-full shadow-[0_0_8px_#FFD700]" />
              )}
              <Icon size={22} className={active ? "drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : ""} />
              <span className={`text-[8px] font-black uppercase tracking-[0.1em] leading-none ${active ? "opacity-100" : "opacity-50"}`}>
                {label.split(' ')[0]}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
