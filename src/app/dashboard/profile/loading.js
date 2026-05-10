export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-pulse">
      <div className="mb-10">
        <div className="h-10 w-64 bg-surface-border/10 rounded-lg mb-2" />
        <div className="h-4 w-48 bg-surface-border/10 rounded-lg" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card h-80 bg-surface-border/10 border-surface-border" />
          <div className="glass-card h-40 bg-surface-border/10 border-surface-border" />
        </div>

        <div className="md:col-span-2">
          <div className="glass-card h-[600px] bg-surface-border/10 border-surface-border" />
        </div>
      </div>
    </div>
  );
}
