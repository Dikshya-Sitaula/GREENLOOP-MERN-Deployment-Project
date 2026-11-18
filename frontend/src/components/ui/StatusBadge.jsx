import { CheckCircle2, CircleDot, Clock, PauseCircle } from 'lucide-react';

// Presentation for listing statuses (the allowed transitions are enforced by the API).
export const STATUS_META = {
  active: { label: 'Active', icon: CircleDot, cls: 'bg-forest-100 text-forest-900' },
  reserved: { label: 'Reserved', icon: Clock, cls: 'bg-marigold-100 text-[#8A5A12]' },
  paused: { label: 'Paused', icon: PauseCircle, cls: 'bg-ink/10 text-ink' },
  completed: { label: 'Completed', icon: CheckCircle2, cls: 'bg-ink text-white' },
};

export default function StatusBadge({ status, className = '' }) {
  const meta = STATUS_META[status];
  if (!meta) return null;
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.cls} ${className}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
      {meta.label}
    </span>
  );
}
