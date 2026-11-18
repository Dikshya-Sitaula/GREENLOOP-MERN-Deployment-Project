import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  const nums = Array.from({ length: pages }, (_, i) => i + 1).filter((n) => n === 1 || n === pages || Math.abs(n - page) <= 1);
  const btn = 'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-sm font-medium transition disabled:opacity-40';
  return (
    <nav className="mt-12 flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button type="button" className={`${btn} border border-line bg-surface hover:border-ink/30`} disabled={page === 1} onClick={() => onChange(page - 1)} aria-label="Previous page">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </button>
      {nums.map((n, i) => (
        <span key={n} className="flex items-center gap-1.5">
          {i > 0 && n - nums[i - 1] > 1 && <span className="text-ink-muted">…</span>}
          <button type="button" onClick={() => onChange(n)} aria-current={n === page ? 'page' : undefined} className={`${btn} num ${n === page ? 'bg-forest-700 text-white' : 'hover:bg-ink/5'}`}>
            {n}
          </button>
        </span>
      ))}
      <button type="button" className={`${btn} border border-line bg-surface hover:border-ink/30`} disabled={page === pages} onClick={() => onChange(page + 1)} aria-label="Next page">
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </nav>
  );
}
