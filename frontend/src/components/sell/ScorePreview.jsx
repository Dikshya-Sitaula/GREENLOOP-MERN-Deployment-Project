import { useEffect, useState } from 'react';
import { Leaf } from 'lucide-react';
import { previewScore } from '../../api/items';
import CircularityRing from '../ui/CircularityRing';
import { formatNumber } from '../../lib/format';

// Debounced live preview from the server-side scoring service.
export default function ScorePreview({ category, condition, type }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!category || !condition || !type) {
      setResult(null);
      return undefined;
    }
    const t = setTimeout(() => {
      previewScore({ category, condition, type }).then(setResult).catch(() => setResult(null));
    }, 250);
    return () => clearTimeout(t);
  }, [category, condition, type]);

  return (
    <aside className="rounded-card border border-line bg-forest-100/60 p-5" aria-live="polite">
      <p className="inline-flex items-center gap-2 text-sm font-semibold text-forest-900"><Leaf className="h-4 w-4" strokeWidth={1.5} /> Circularity Score preview</p>
      {result ? (
        <div className="mt-4 flex items-center gap-4">
          <CircularityRing score={result.score} size={64} stroke={6} />
          <div>
            <p className="font-display text-2xl text-forest-900">{result.band}</p>
            <p className="num text-xs text-forest-700">≈ {formatNumber(result.estimatedKg, 1)} kg kept in use (est.)</p>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-forest-700">Choose a category and condition to see your score.</p>
      )}
    </aside>
  );
}
