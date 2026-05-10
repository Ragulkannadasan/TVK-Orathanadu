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
          className="fixed inset-0 bg-black/60 z-[-1] animate-fade-in"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Menu Content */}
      <div className={`absolute bottom-full left-0 right-0 mb-4 bg-surface/90 backdrop-blur-2xl border border-surface-border rounded-3xl overflow-hidden transition-all duration-500 transform ${
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
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                pathname === href ? "bg-accent/20 text-gold-dynamic" : "text-text-muted hover:bg-surface-border/10"
              }`}
            >
              <Icon size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest text-center">{label}</span>
            </Link>
          ))}
        </div>
      </div>

      <nav className="bg-surface/80 backdrop-blur-2xl px-2 py-3 flex items-center justify-around shadow-lg border border-surface-border rounded-3xl overflow-hidden relative">
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
              className={`flex flex-col items-center gap-1.5 transition-all duration-200 relative flex-1 ${
                active ? "text-gold-dynamic" : "text-[#666] hover:text-foreground"
              }`}
            >
              <Icon size={22} />
              <span className={`text-[8px] font-black uppercase tracking-[0.1em] leading-none ${active ? "opacity-100" : "opacity-40"}`}>
                {label.split(' ')[0]}
              </span>
            </Link>
          );
        })}

        {/* More Button */}
        <button
          onClick={() => setShowMore(!showMore)}
          className={`flex flex-col items-center gap-1.5 transition-all duration-200 relative flex-1 ${
            showMore ? "text-gold-dynamic" : "text-[#666]"
          }`}
        >
          {showMore ? <X size={22} /> : <MoreHorizontal size={22} />}
          <span className="text-[8px] font-black uppercase tracking-[0.1em] leading-none opacity-40">
            {showMore ? "Close" : "More"}
          </span>
        </button>
      </nav>
    </div>
  );
}
