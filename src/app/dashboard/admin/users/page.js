import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserTable from "./user-table";
import { auth } from "@/auth";

export default async function AdminUsersPage() {
  await dbConnect();
  const session = await auth();
  const users = await User.find({}).sort({ createdAt: -1 }).lean();
  
  // Serialize Mongo IDs
  const serializedUsers = JSON.parse(JSON.stringify(users));

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-white display-font mb-1">
            User <span className="gradient-text">Management</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base mt-2">
            Manage all registered members, assign roles, and verify status.
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="px-3 py-2 rounded-xl glass-card border-white/5">
            <span className="text-white/40">Total Members:</span>
            <span className="ml-2 text-white font-bold">{users.length}</span>
          </div>
        </div>
      </div>

      <UserTable 
        initialUsers={serializedUsers} 
        currentUserEmail={session?.user?.email} 
      />
    </div>
  );
}
