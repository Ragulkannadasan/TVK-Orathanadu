"use client";

import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function PublicNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full z-[100] bg-background/60 backdrop-blur-xl border-b border-surface-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-lg bg-transparent flex items-center justify-center overflow-hidden transition-transform group-hover:scale-110">
            <img src="/icon.png" alt="TVK" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-foreground font-black text-sm md:text-base display-font tracking-tight leading-none group-hover:text-gold-dynamic transition-colors">
              TVK 175
            </span>
            <span className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em] mt-0.5">
              ஒரத்தநாடு
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-foreground hover:text-gold-dynamic transition-colors">முகப்பு / Home</Link>
          <Link href="/login" className="text-sm font-bold text-text-muted hover:text-foreground transition-colors">புகார்கள் / Grievances</Link>
          <div className="h-4 w-[1px] bg-surface-border mx-2" />
          <ThemeToggle />
          <Link 
            href="/login" 
            className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2"
          >
            <User size={14} />
            உள்நுழை / Login
          </Link>
        </div>

        {/* Mobile Toggle */}
        <div className="flex md:hidden items-center gap-4">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground p-1"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-surface-border animate-fade-in py-6 px-4 space-y-4 shadow-2xl">
          <Link 
            href="/" 
            onClick={() => setIsOpen(false)}
            className="block text-lg font-bold text-foreground px-4 py-2 hover:bg-surface-border/10 rounded-xl"
          >
            முகப்பு / Home
          </Link>
          <Link 
            href="/login" 
            onClick={() => setIsOpen(false)}
            className="block text-lg font-bold text-text-muted px-4 py-2 hover:bg-surface-border/10 rounded-xl"
          >
            புகார்கள் / Grievances
          </Link>
          <div className="pt-4 px-4">
            <Link 
              href="/login" 
              onClick={() => setIsOpen(false)}
              className="btn-primary w-full py-4 text-center text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <User size={18} />
              Login
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
