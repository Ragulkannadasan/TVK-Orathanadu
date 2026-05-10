export default function Loading() {
  return (
    <div className="p-4 md:p-6 max-w-5xl animate-fade-in">
      <div className="mb-8 space-y-4">
        <div className="h-10 w-48 bg-surface-border/10 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-surface-border/10 rounded-lg animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-surface-border/10 rounded-2xl animate-pulse" />
        ))}
      </div>

      <div className="h-64 bg-surface-border/10 rounded-2xl animate-pulse mb-8" />

      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-surface-border/10 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}
