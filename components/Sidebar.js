'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
  Star,
  MessageSquare,
} from 'lucide-react';

const navItems = {
  Voter: [
    { href: '/dashboard', label: 'Dashboard', labelTa: 'டாஷ்போர்ட்', icon: LayoutDashboard },
    { href: '/dashboard/grievances', label: 'My Grievances', labelTa: 'என் புகார்கள்', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', labelTa: 'சுயவிவரம்', icon: Settings },
    { href: '/dashboard/feedback', label: 'Feedback', labelTa: 'பின்னூட்டம்', icon: MessageSquare },
  ],
  Poruppalar: [
    { href: '/poruppalar', label: 'Dashboard', labelTa: 'டாஷ்போர்ட்', icon: LayoutDashboard },
    { href: '/poruppalar/grievances', label: 'Booth Grievances', labelTa: 'சாவடி புகார்கள்', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', labelTa: 'சுயவிவரம்', icon: Settings },
    { href: '/dashboard/feedback', label: 'Feedback', labelTa: 'பின்னூட்டம்', icon: MessageSquare },
  ],
  Admin: [
    { href: '/admin', label: 'Analytics', labelTa: 'பகுப்பாய்வு', icon: LayoutDashboard },
    { href: '/admin/users', label: 'Users', labelTa: 'பயனர்கள்', icon: Users },
    { href: '/admin/grievances', label: 'All Grievances', labelTa: 'அனைத்து புகார்கள்', icon: FileText },
    { href: '/dashboard/profile', label: 'Profile', labelTa: 'சுயவிவரம்', icon: Settings },
    { href: '/dashboard/feedback', label: 'Feedback', labelTa: 'பின்னூட்டம்', icon: MessageSquare },
  ],
};

const roleColors = {
  Admin: { bg: 'bg-purple-500/20', text: 'text-purple-400', icon: Shield },
  Poruppalar: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Star },
  Voter: { bg: 'bg-green-500/20', text: 'text-green-400', icon: Users },
};

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const role = session?.user?.role || 'Voter';
  const items = navItems[role] || navItems.Voter;
  const roleStyle = roleColors[role] || roleColors.Voter;
  const RoleIcon = roleStyle.icon;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
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
          <p className="text-white text-sm font-semibold truncate">{session.user.name || 'Member'}</p>
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
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                active
                  ? 'bg-[#800000] text-[#FFD700] shadow-lg shadow-red-900/30'
                  : 'text-[#a0a0a0] hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={active ? 'text-[#FFD700]' : 'group-hover:text-white'} />
              <div>
                <p className="text-sm font-medium leading-none">{label}</p>
                <p className="text-[10px] mt-0.5 opacity-70 tamil">{labelTa}</p>
              </div>
            </Link>
          );
        })}
      </nav>

    </div>
  );

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#0a0a0a]/95 backdrop-blur-2xl border-t border-white/10 pb-safe pt-1">
        <div className="flex justify-around items-center h-16 px-1">
          {items.map(({ href, label, icon: Icon }) => {
            // Precise active logic to prevent 'dashboard' from highlighting when in 'dashboard/grievances'
            const active = href === '/dashboard' || href === '/admin' || href === '/poruppalar' 
              ? pathname === href 
              : pathname.startsWith(href);
              
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-all duration-300 relative ${
                  active ? 'text-[#FFD700]' : 'text-[#a0a0a0] hover:text-white'
                }`}
              >
                {active && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#800000] rounded-b-full shadow-[0_0_8px_rgba(255,215,0,0.5)]"></span>
                )}
                <Icon size={22} className={`transition-transform duration-300 ${active ? 'scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]' : ''}`} />
                <span className="text-[10px] font-medium tracking-wide">{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-[#080808]/80 backdrop-blur-xl border-r border-white/10 fixed h-full z-30">
        <SidebarContent />
      </aside>
    </>
  );
}
