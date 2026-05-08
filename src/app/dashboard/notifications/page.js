import { auth } from "@/auth";
import { getNotifications } from "@/actions/notification";
import NotificationList from "./notification-list";

export const metadata = { title: "Notifications – TVK Orathanadu" };

export default async function NotificationsPage() {
  const session = await auth();
  const notifications = await getNotifications();
  const isAdmin = session?.user?.role === "Admin";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white display-font mb-1">
          Constituency <span className="gradient-text">Notifications</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base">
          Stay updated with official announcements and alerts.
        </p>
      </div>

      <NotificationList initialNotifications={notifications} isAdmin={isAdmin} />
    </div>
  );
}
