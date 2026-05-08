export default function Loading() {
  return (
    <div className="p-4 space-y-6 animate-pulse">
      <div className="h-8 w-48 bg-white/5 rounded-lg mb-8" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-card h-32 bg-white/5 border-white/5" />
        ))}
      </div>

      <div className="glass-card h-64 bg-white/5 border-white/5" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card h-96 bg-white/5 border-white/5" />
        <div className="glass-card h-96 bg-white/5 border-white/5" />
      </div>
    </div>
  );
}
