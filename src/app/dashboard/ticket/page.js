import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import DigitalTicket from "@/components/DigitalTicket";

export const metadata = { title: "My Digital Ticket – TVK Orathanadu" };

export default async function TicketPage() {
  const session = await auth();
  
  await dbConnect();
  const user = await User.findOne({ email: session.user.email }).lean();

  return (
    <div className="p-4 md:p-6 min-h-[80vh] flex flex-col items-center justify-center">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-white display-font mb-2">
          Digital <span className="gradient-text">Ticket</span>
        </h1>
        <p className="text-white/40 text-xs md:text-sm uppercase font-black tracking-widest">
          Your Official Identity for TVK Events
        </p>
      </div>

      <DigitalTicket user={JSON.parse(JSON.stringify(user))} />
    </div>
  );
}
