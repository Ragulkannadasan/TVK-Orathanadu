"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/nav";
import { useState, useEffect } from "react";

import { MoreHorizontal, X } from "lucide-react";

export default function MobileNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState(null);
  const [showMore, setShowMore] = useState(false);

  // Clear pending state when we successfully navigate
  useEffect(() => {
    setPendingHref(null);
    setShowMore(false);
  }, [pathname]);

  const role = session?.user?.role || "Voter";
  const allItems = (navItems[role] || navItems.Voter).filter(item => item.href !== "/dashboard/notifications");
  
  const visibleItems = allItems.slice(0, 4);
  const moreItems = allItems.slice(4);

  return (
    <div className="md:hidden fixed bottom-4 left-3 right-3 z-50">
      {/* More Menu Backdrop */}
      {showMore && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1] animate-fade-in"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Content */}
      <div className={`absolute bottom-full left-0 right-0 mb-4 bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 transform ${
        showMore ? "translate-y-0 opacity-100 scale-100" : "translate-y-10 opacity-0 scale-95 pointer-events-none"
      }`}>
        <div className="p-4 grid grid-cols-3 gap-4">
          {moreItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => {
                if (href !== pathname) setPendingHref(href);
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                pathname === href ? "bg-[#800000]/20 text-[#FFD700]" : "text-white/60 hover:bg-white/5"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <nav className="bg-[#0a0a0a] px-2 py-3 flex items-center justify-around shadow-[0_8px_32px_rgba(0,0,0,0.8)] border border-white/10 rounded-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-[#800000]/10 to-transparent -z-10" />
        
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pendingHref === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => {
                if (href !== pathname) setPendingHref(href);
              }}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative flex-1 ${
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

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center gap-1.5 transition-all duration-300 relative flex-1 ${
            showMore ? "text-[#FFD700] scale-110" : "text-[#a0a0a0]"
          }`}
        >
          {showMore ? <X size={22} /> : <MoreHorizontal size={22} />}
          <span className="text-[8px] font-black uppercase tracking-[0.1em] leading-none opacity-50">
            {showMore ? "Close" : "More"}
          </span>
        </button>
      </nav>
    </div>
  );
}
