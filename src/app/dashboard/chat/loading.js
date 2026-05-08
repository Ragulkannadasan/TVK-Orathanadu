export default function Loading() {
  return (
    <div className="h-[calc(100vh-160px)] flex flex-col animate-pulse">
      <div className="h-16 bg-white/5 border-b border-white/5 mb-4" />
      <div className="flex-1 space-y-4 px-4 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
            <div className={`h-16 w-64 bg-white/5 rounded-2xl ${i % 2 === 0 ? 'rounded-tr-none' : 'rounded-tl-none'}`} />
          </div>
        ))}
      </div>
      <div className="h-20 bg-white/5 border-t border-white/5 mt-4" />
    </div>
  );
}
