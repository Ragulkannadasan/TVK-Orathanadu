import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";
import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const dbUser = await getSessionUser();

  if (!dbUser) {
    redirect("/login");
  }
  
  // dbUser is already plain and complete from the cached helper
  const displayUser = dbUser;

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <Sidebar user={displayUser} />
      <MobileNav />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileHeader user={displayUser} />
        <main className="flex-1 overflow-y-auto bg-transparent relative pb-24 md:pb-0">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

