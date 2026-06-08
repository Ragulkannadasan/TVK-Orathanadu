import { getSessionUser } from "@/lib/session";
import { redirect } from "next/navigation";
import SwipeableAppShell from "@/components/SwipeableAppShell";
import { navItems } from "@/lib/nav";

// Voter & Shared Views
import VoterDashboard from "./voter/view";
import NotificationsView from "./notifications/view";
import TicketView from "./ticket/view";
import EventsView from "./events/view";
import GrievancesView from "./grievances/view";
import ProfileView from "./profile/view";
import ChatView from "../chat/view";

// Leader specific
import LeaderDashboard from "./leader/view";
import BoothGrievances from "./grievances/booth/view";

// Admin specific
import AdminDashboard from "./admin/view";
import AdminScanner from "./admin/scanner/view";
import AdminEvents from "./admin/events/view";
import AdminUsers from "./admin/users/view";
import AdminGrievances from "./admin/grievances/view";

export const metadata = { title: "Dashboard – TVK Orathanadu" };

export default async function DashboardPage({ searchParams }) {
  const userDoc = await getSessionUser();

  if (!userDoc) {
    redirect("/login");
  }

  const role = userDoc.role;
  const slides = [];

  // Define mapping of href to components
  const componentMap = {
    "/dashboard/voter": <VoterDashboard searchParams={searchParams} />,
    "/dashboard/notifications": <NotificationsView searchParams={searchParams} />,
    "/dashboard/ticket": <TicketView searchParams={searchParams} />,
    "/dashboard/events": <EventsView searchParams={searchParams} />,
    "/dashboard/grievances": <GrievancesView searchParams={searchParams} />,
    "/chat": <ChatView searchParams={searchParams} />,
    "/dashboard/profile": <ProfileView searchParams={searchParams} />,

    // Leader
    "/dashboard/leader": <LeaderDashboard searchParams={searchParams} />,
    "/dashboard/grievances/booth": <BoothGrievances searchParams={searchParams} />,

    // Admin
    "/dashboard/admin": <AdminDashboard searchParams={searchParams} />,
    "/dashboard/admin/scanner": <AdminScanner searchParams={searchParams} />,
    "/dashboard/admin/events": <AdminEvents searchParams={searchParams} />,
    "/dashboard/admin/users": <AdminUsers searchParams={searchParams} />,
    "/dashboard/admin/grievances": <AdminGrievances searchParams={searchParams} />,
  };

  const params = await searchParams;
  const activeTabId = params?.tab || "dashboard";

  // Build slides based on user role's navItems
  const userNavItems = navItems[role] || navItems.Voter;

  userNavItems.forEach((navItem) => {
    if (componentMap[navItem.href]) {
      // Create a unique ID for each tab based on its href
      let id = navItem.href.replace("/dashboard/", "").replace(/\//g, "-");
      if (id === "dashboard" || id === "voter" || id === "leader" || id === "admin") id = "dashboard";
      if (navItem.href === "/chat") id = "chat";

      if (navItem.href !== "/dashboard/notifications") {
        slides.push({
          id,
          component: componentMap[navItem.href],
          href: navItem.href
        });
      }
    }
  });

  return (
    <SwipeableAppShell
      user={userDoc}
      slides={slides}
      notificationsComponent={componentMap["/dashboard/notifications"]}
    />
  );
}
