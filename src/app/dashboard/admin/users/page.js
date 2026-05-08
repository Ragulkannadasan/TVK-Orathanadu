export default function AdminUsersPage() {
  return (
    <div className="p-4 md:p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white display-font mb-1">
          User <span className="gradient-text">Management</span>
        </h1>
        <p className="text-white/60 text-sm md:text-base mt-2">
          Manage all registered members and roles
        </p>
      </div>

      <div className="glass-card p-8 text-center">
        <div className="w-16 h-16 bg-[#800000]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#FFD700]/30">
          <span className="text-2xl">👥</span>
        </div>
        <h2 className="text-white font-bold text-xl mb-4">Member Directory</h2>
        <p className="text-white/50 max-w-md mx-auto">
          Administrative control for user roles, booth assignments, and membership verification will be available here soon.
        </p>
      </div>
    </div>
  );
}
