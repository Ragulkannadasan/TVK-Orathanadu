import { auth } from "@/auth";
import { getEvents, getBookings } from "@/actions/event";
import UserEventList from "./user-event-list";
import { Calendar } from "lucide-react";

export const metadata = { title: "Events – TVK Orathanadu" };

export default async function UserEventsPage() {
  const session = await auth();
  if (!session) return null;

  const events = await getEvents();
  const bookings = await getBookings();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground display-font mb-1">
          Constituency <span className="gradient-text">Events</span>
        </h1>
        <p className="text-text-muted text-sm md:text-base uppercase font-black tracking-widest flex items-center gap-2">
          <Calendar size={14} className="text-gold-dynamic" /> Join Our Gatherings
        </p>
      </div>

      <UserEventList 
        initialEvents={events} 
        initialBookings={bookings}
      />
    </div>
  );
}
