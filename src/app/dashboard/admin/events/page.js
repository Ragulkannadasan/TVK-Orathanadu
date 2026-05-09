import { auth } from "@/auth";
import { getEvents } from "@/actions/event";
import EventList from "./event-list";
import { Calendar } from "lucide-react";

export const metadata = { title: "Event Management – TVK Orathanadu" };

export default async function EventsPage() {
  const session = await auth();
  if (session?.user?.role !== "Admin") {
    return <div className="p-10 text-center text-white/40 uppercase font-black tracking-widest">Unauthorized Access</div>;
  }

  const events = await getEvents();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white display-font mb-1">
          Constituency <span className="gradient-text">Events</span>
        </h1>
        <p className="text-white/40 text-sm md:text-base uppercase font-black tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-[#FFD700]" /> Manage & Track Gatherings
        </p>
      </div>

      <EventList initialEvents={events} />
    </div>
  );
}
