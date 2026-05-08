import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import MobileHeader from "@/components/MobileHeader";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import User from "@/models/User";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Fetch fresh user data from DB to ensure profile photo is always current
  await dbConnect();
  const dbUser = await User.findOne({ email: session.user.email }).lean();
  
  // Create a merged user object
  const displayUser = {
    ...session.user,
    image: dbUser?.image || session.user.image,
    name: dbUser?.name || session.user.name
  };

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

