import { TYPE_META } from '../../lib/listingTypes';

export default function TypePill({ type, className = '' }) {
  const meta = TYPE_META[type];
  if (!meta) return null;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.pill} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden />
      {meta.label}
    </span>
  );
}
