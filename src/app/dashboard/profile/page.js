import { auth } from "@/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import LogoutButton from "@/components/LogoutButton";
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
        <h2 className="text-foreground font-bold text-xl mb-4">Local Auth Mode</h2>
        <p className="text-text-muted max-w-md mx-auto mb-6">
          You are logged in via the local JSON file. Profile updates are only available for users registered in the MongoDB database.
        </p>
        <LogoutButton className="max-w-xs mx-auto" />
      </div>
    );
  }

  // Serialize MongoDB object
  user = JSON.parse(JSON.stringify(user));

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-foreground display-font mb-1">
          Profile <span className="gradient-text">Settings</span>
        </h1>
        <p className="text-text-muted text-sm md:text-base">
          Manage your personal and voter information
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center relative overflow-hidden">
            {/* Profile Avatar Display */}
            <div className="relative w-28 h-28 mx-auto mb-4 p-1 rounded-full bg-gradient-to-tr from-[#FFD700] via-[#800000] to-[#FFD700] shadow-lg">
              <div className="w-full h-full rounded-full bg-black p-0.5">
                <div 
                  className="w-full h-full rounded-full bg-[#1a1a1a] flex items-center justify-center overflow-hidden border border-surface-border"
                  suppressHydrationWarning
                >
                  {user.image ? (
                    <img 
                      src={user.image} 
                      alt={user.name} 
                      className="w-full h-full object-cover"
                      suppressHydrationWarning
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gold-dynamic">{user.name[0]}</span>
                  )}
                </div>
              </div>
            </div>
            <h3 className="text-foreground font-bold text-lg">{user.name}</h3>
            <p className="text-gold-dynamic text-xs font-bold mb-1">@{user.username || user.email.split('@')[0]}</p>
            <p className="text-text-muted text-[10px] truncate mb-4">{user.email}</p>
            <div className="mt-4 px-4 py-1.5 rounded-full bg-[#FFD700]/10 text-gold-dynamic text-[10px] font-black uppercase tracking-widest inline-block border border-[#FFD700]/20">
              {user.role}
            </div>
          </div>
          
          <div className="glass-card p-5 space-y-5">
            <div className="flex items-center gap-3 text-text-muted">
              <div className="p-2 rounded-lg bg-surface-border/10 border border-surface-border">
                <MapPin size={16} className="text-gold-dynamic" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase font-black">Panchayat</span>
                <span className="text-xs font-bold text-foreground">{user.panchayat || "Not Set"}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-text-muted">
              <div className="p-2 rounded-lg bg-surface-border/10 border border-surface-border">
                <Contact size={16} className="text-gold-dynamic" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-text-muted uppercase font-black">Booth Number</span>
                <span className="text-xs font-bold text-foreground">{user.boothNumber || "Not Set"}</span>
              </div>
            </div>
          </div>

          <LogoutButton />
        </div>

        <div className="md:col-span-2">
          <div className="glass-card p-8 border-surface-border">
            <h3 className="text-foreground font-bold text-xl mb-8 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/20 text-gold-dynamic">
                <UserCircle size={20} />
              </div>
              Edit Account Profile
            </h3>
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
