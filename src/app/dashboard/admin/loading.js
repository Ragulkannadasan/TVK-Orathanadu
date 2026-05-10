export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-10 space-y-4">
        <div className="h-10 w-64 bg-surface-border/10 rounded-lg animate-pulse" />
        <div className="h-4 w-96 bg-surface-border/10 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-border/10 rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-96 bg-surface-border/10 rounded-2xl animate-pulse" />
        <div className="h-96 bg-surface-border/10 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
}
