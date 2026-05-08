import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import ProfileForm from "./profile-form";
import { UserCircle, MapPin, Contact } from "lucide-react";

export const metadata = { title: "Profile Management – TVK Orathanadu" };

export default async function ProfilePage() {
  const session = await auth();
  await dbConnect();

  let user = await User.findOne({ email: session.user.email }).lean();

  if (!user) {
    // If user is from JSON file, they can't update profile in DB unless we create a record for them
    // For this rewrite, we'll assume only signed up users or those we migrate can update
    return (
      <div className="p-10 text-center">
        <h2 className="text-white font-bold text-xl mb-4">Local Auth Mode</h2>
        <p className="text-white/50 max-w-md mx-auto">
          You are logged in via the local JSON file. Profile updates are only available for users registered in the MongoDB database.
        </p>
      </div>
    );
  }

  // Serialize MongoDB object
  user = JSON.parse(JSON.stringify(user));

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white display-font mb-1">
          Profile <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base mt-2">
          Manage your personal and voter information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
           <div className="glass-card p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-[#800000]/20 border-2 border-[#FFD700]/30 flex items-center justify-center text-[#FFD700] text-3xl font-bold mx-auto mb-4">
                {user.name[0]}
              </div>
              <h3 className="text-white font-bold text-lg">{user.name}</h3>
              <p className="text-white/40 text-xs mt-1">{user.email}</p>
              <div className="mt-4 px-3 py-1 rounded-full bg-[#FFD700]/10 text-[#FFD700] text-[10px] font-bold uppercase tracking-widest inline-block border border-[#FFD700]/20">
                {user.role}
              </div>
           </div>
           
           <div className="glass-card p-4 space-y-4">
              <div className="flex items-center gap-3 text-white/70">
                 <MapPin size={18} className="text-[#FFD700]" />
                 <span className="text-xs font-medium">{user.panchayat || "No Panchayat Set"}</span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                 <Contact size={18} className="text-[#FFD700]" />
                 <span className="text-xs font-medium">Booth: {user.boothNumber || "Not Set"}</span>
              </div>
           </div>
        </div>

        <div className="md:col-span-2">
           <div className="glass-card p-8">
              <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                 <UserCircle className="text-[#FFD700]" /> Edit Profile
              </h3>
              <ProfileForm user={user} />
           </div>
        </div>
      </div>
    </div>
  );
}
