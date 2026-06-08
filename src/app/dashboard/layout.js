import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-transparent">
      {children}
    </div>
  );
}

