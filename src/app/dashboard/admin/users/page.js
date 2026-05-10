import dbConnect from "@/lib/db";
import User from "@/models/User";
import UserTable from "./user-table";
import { getSession } from "@/lib/session";

export default async function AdminUsersPage({ searchParams }) {
  console.time("AdminUsersPage_Total");
  const params = await searchParams;
  const page = parseInt(params.page) || 1;
  const search = (params.search || "").trim();
  const limit = 10;
  const skip = (page - 1) * limit;

  console.time("AdminUsersPage_DB_Connect");
  await dbConnect();
  console.timeEnd("AdminUsersPage_DB_Connect");

  console.time("AdminUsersPage_Session");
  const session = await getSession();
  console.timeEnd("AdminUsersPage_Session");

  // Build query
  const query = search ? {
    $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { username: { $regex: search, $options: 'i' } }
    ]
  } : {};

  console.time("AdminUsersPage_Query");
  // Temporarily removed .sort({ createdAt: -1 }) to test performance
  const [users, totalCount] = await Promise.all([
    User.find(query)
      .select('name email role boothNumber panchayat image username createdAt')
      .skip(skip)
      .limit(limit)
      .lean(),
    search ? User.countDocuments(query) : User.estimatedDocumentCount()
  ]);
  console.timeEnd("AdminUsersPage_Query");
  
  const serializedUsers = users.map(u => ({
    _id: u._id.toString(),
    name: u.name || 'Unknown',
    email: u.email || '',
    role: u.role || 'Voter',
    boothNumber: u.boothNumber || '',
    panchayat: u.panchayat || '',
    image: u.image || '',
    username: u.username || '',
    createdAt: u.createdAt ? u.createdAt.toISOString() : new Date().toISOString()
  }));

  const totalPages = Math.ceil(totalCount / limit);
  console.timeEnd("AdminUsersPage_Total");

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto pb-20">
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground display-font mb-1">
            User <span className="gradient-text">Management</span>
          </h1>
          <p className="text-text-muted text-sm md:text-base mt-2">
            Manage all registered members, assign roles, and verify status.
          </p>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="px-3 py-2 rounded-xl glass-card border-surface-border">
            <span className="text-text-muted">Total Filtered:</span>
            <span className="ml-2 text-foreground font-bold">{totalCount}</span>
          </div>
        </div>
      </div>

      <UserTable 
        initialUsers={serializedUsers} 
        currentUserEmail={session?.user?.email} 
        pagination={{
          currentPage: page,
          totalPages,
          totalCount,
          search
        }}
      />
    </div>
  );
}
