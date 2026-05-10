import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import Grievance from "@/models/Grievance";
import User from "@/models/User";
import GrievanceForm from "./grievance-form";
import { PlusCircle, ListTodo } from "lucide-react";

export const metadata = { title: "My Grievances – TVK Orathanadu" };

export default async function GrievancesPage() {
  const session = await auth();
  await dbConnect();

  const user = await User.findOne({ email: session.user.email }).lean();
  
  const grievances = await Grievance.find({ userId: user?._id })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="p-4 md:p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground display-font mb-1">
          Grievance <span className="gradient-text">Redressal</span>
        </h1>
        <p className="text-text-muted text-sm md:text-base mt-2">
          Submit and track your constituency issues
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form Section */}
        <div className="lg:col-span-1">
           <div className="sticky top-6">
              <div className="flex items-center gap-2 mb-6">
                <PlusCircle className="text-gold-dynamic" size={20} />
                <h2 className="text-foreground font-bold text-lg">New Grievance</h2>
              </div>
              <div className="glass-card p-6">
                <GrievanceForm userId={user?._id?.toString()} panchayat={user?.panchayat} booth={user?.boothNumber} />
              </div>
           </div>
        </div>

        {/* List Section */}
        <div className="lg:col-span-2">
           <div className="flex items-center gap-2 mb-6">
              <ListTodo className="text-gold-dynamic" size={20} />
              <h2 className="text-foreground font-bold text-lg">My Submissions</h2>
           </div>
           
           <div className="space-y-4">
              {grievances.length === 0 ? (
                <div className="glass-card p-20 text-center text-text-muted italic">
                  You haven't submitted any grievances yet.
                </div>
              ) : (
                grievances.map((g) => (
                  <div key={g._id.toString()} className="glass-card p-5 group hover:border-[#800000]/40 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#800000]/20 text-gold-dynamic uppercase font-bold tracking-widest border border-[#800000]/30">
                        {g.category}
                      </span>
                      <StatusPill status={g.status} />
                    </div>
                    <h3 className="text-foreground font-bold text-lg mb-1">{g.title}</h3>
                    <p className="text-text-muted text-sm leading-relaxed mb-4">{g.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-surface-border text-[10px] text-text-muted uppercase tracking-widest font-bold">
                       <span>Submitted on {new Date(g.createdAt).toLocaleDateString()}</span>
                       <span>#{g._id.toString().slice(-6)}</span>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>
      </div>
    </div>
  );
}

function StatusPill({ status }) {
  const colors = {
    Pending: "badge-pending",
    Investigating: "badge-investigating",
    Resolved: "badge-resolved",
  };
  return (
    <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${colors[status] || ""}`}>
      {status}
    </span>
  );
}
