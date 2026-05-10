import { getSession } from "@/lib/session";
import { getEvents } from "@/actions/event";
import EventList from "./event-list";
import { Calendar } from "lucide-react";

export const metadata = { title: "Event Management – TVK Orathanadu" };

export default async function EventsPage() {
  const session = await getSession();
  if (session?.user?.role !== "Admin") {
    return <div className="p-10 text-center text-text-muted uppercase font-black tracking-widest">Unauthorized Access</div>;
  }

  const events = await getEvents();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground display-font mb-1">
          Constituency <span className="gradient-text">Events</span>
        </h1>
        <p className="text-text-muted text-sm md:text-base uppercase font-black tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-gold-dynamic" /> Manage & Track Gatherings
        </p>
      </div>

      <EventList initialEvents={events} />
    </div>
  );
}
