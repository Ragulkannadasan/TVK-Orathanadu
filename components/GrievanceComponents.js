'use client';

const statusConfig = {
  Pending: { label: 'Pending', labelTa: 'நிலுவையில்', className: 'badge-pending' },
  Investigating: { label: 'Investigating', labelTa: 'விசாரணையில்', className: 'badge-investigating' },
  Resolved: { label: 'Resolved', labelTa: 'தீர்க்கப்பட்டது', className: 'badge-resolved' },
};

const categoryIcons = {
  Agriculture: '🌾',
  Water: '💧',
  Road: '🛣️',
  Electricity: '⚡',
  Other: '📋',
};

export function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.Pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
      {config.label}
      <span className="opacity-70 tamil text-[10px]">({config.labelTa})</span>
    </span>
  );
}

export function CategoryBadge({ category }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-white/80">
      {categoryIcons[category] || '📋'} {category}
    </span>
  );
}

export function TicketCard({ grievance, onUpdate, showActions }) {
  return (
    <div className="glass rounded-xl p-4 hover:border-white/15 transition-all duration-200 animate-fade-in-up">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[#FFD700] text-xs font-mono font-bold">#{grievance.ticketId}</span>
            <CategoryBadge category={grievance.category} />
            <StatusBadge status={grievance.status} />
          </div>
          <p className="text-white/90 text-sm leading-relaxed line-clamp-2">{grievance.description}</p>
          {grievance.userId?.name && (
            <p className="text-white/40 text-xs mt-2">
              By: {grievance.userId.name} · {grievance.userId.panchayat}
            </p>
          )}
          {grievance.actionNotes && (
            <div className="mt-3 p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-xs font-medium">Action Taken:</p>
              <p className="text-white/70 text-xs mt-0.5">{grievance.actionNotes}</p>
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-white/30 text-xs">
            {new Date(grievance.createdAt).toLocaleDateString('ta-IN')}
          </p>
        </div>
      </div>
      {showActions && onUpdate && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <ActionPanel grievance={grievance} onUpdate={onUpdate} />
        </div>
      )}
    </div>
  );
}

function ActionPanel({ grievance, onUpdate }) {
  const statuses = ['Pending', 'Investigating', 'Resolved'];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => onUpdate(grievance._id, { status: s })}
          disabled={grievance.status === s}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
            grievance.status === s
              ? 'bg-white/10 text-white/40 cursor-not-allowed'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Mark {s}
        </button>
      ))}
    </div>
  );
}
