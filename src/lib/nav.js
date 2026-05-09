import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  MessageCircle,
  Bell,
} from "lucide-react";

export const navItems = {
  Voter: [
    { href: "/dashboard/voter", label: "Dashboard", labelTa: "டாஷ்போர்ட்", icon: LayoutDashboard },
    { href: "/dashboard/notifications", label: "Notifications", labelTa: "அறிவிப்புகள்", icon: Bell },
    { href: "/dashboard/grievances", label: "Grievances", labelTa: "புகார்கள்", icon: FileText },
    { href: "/chat", label: "Chat", labelTa: "உரையாடல்", icon: MessageCircle },
    { href: "/dashboard/profile", label: "Profile", labelTa: "சுயவிவரம்", icon: Settings },
  ],
  Poruppalar: [
    { href: "/dashboard/leader", label: "Dashboard", labelTa: "டாஷ்போர்ட்", icon: LayoutDashboard },
    { href: "/dashboard/notifications", label: "Notifications", labelTa: "அறிவிப்புகள்", icon: Bell },
    { href: "/dashboard/grievances/booth", label: "Booth", labelTa: "சாவடி", icon: FileText },
    { href: "/chat", label: "Chat", labelTa: "உரையாடல்", icon: MessageCircle },
    { href: "/dashboard/profile", label: "Profile", labelTa: "சுயவிவரம்", icon: Settings },
  ],
  Admin: [
    { href: "/dashboard/admin", label: "Analytics", labelTa: "பகுப்பாய்வு", icon: LayoutDashboard },
    { href: "/dashboard/notifications", label: "Notifications", labelTa: "அறிவிப்புகள்", icon: Bell },
    { href: "/dashboard/admin/users", label: "Users", labelTa: "பயனர்கள்", icon: Users },
    { href: "/dashboard/admin/grievances", label: "Grievances", labelTa: "புகார்கள்", icon: FileText },
    { href: "/chat", label: "Chat", labelTa: "உரையாடல்", icon: MessageCircle },
    { href: "/dashboard/profile", label: "Profile", labelTa: "சுயவிவரம்", icon: Settings },
  ],
};
