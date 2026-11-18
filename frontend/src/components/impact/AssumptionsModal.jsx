import Modal from '../ui/Modal';
import { ErrorState, Skeleton } from '../ui/States';
import { fetchAssumptions } from '../../api/community';
import { useAsync } from '../../lib/hooks';
import { formatNpr } from '../../lib/format';

export default function AssumptionsModal({ open, onClose }) {
  const { data, loading, error, reload } = useAsync(fetchAssumptions, []);
  return (
    <Modal open={open} onClose={onClose} title="How we calculate" size="max-w-2xl">
      <div className="space-y-4 text-sm text-ink-muted">
        <p>Every figure on GreenLoop is an <strong className="text-ink">estimate</strong>. We use simple, published assumptions so you can see exactly where numbers come from.</p>
        {loading ? <Skeleton className="h-48" /> : error ? <ErrorState message={error.message} onRetry={reload} /> : (
          <>
            <ul className="list-disc space-y-1.5 pl-5">
              <li><strong className="text-ink">Kilograms diverted</strong> = average weight of the item&apos;s category (table below).</li>
              <li><strong className="text-ink">CO₂e avoided</strong> ≈ {data.co2PerKg} kg per kg of goods not newly produced.</li>
              <li><strong className="text-ink">Rs. circulated</strong> = the listed price, or the category&apos;s typical value for swaps and donations.</li>
              <li><strong className="text-ink">Circularity Score</strong> = condition ({data.scoreMax.condition}) + category longevity ({data.scoreMax.longevity}) + repairability ({data.scoreMax.repairability}) + reuse demand ({data.scoreMax.demand}) + pass-it-on bonus ({data.scoreMax.type}).</li>
            </ul>
            <div className="overflow-hidden rounded-lg border border-line">
              <table className="w-full text-left">
                <thead className="bg-paper text-xs uppercase tracking-wider text-ink-muted"><tr><th className="px-4 py-2.5">Category</th><th className="px-4 py-2.5">Avg. weight</th><th className="px-4 py-2.5">Typical value</th></tr></thead>
                <tbody>
                  {data.categories.map((c) => (
                    <tr key={c.name} className="border-t border-line"><td className="px-4 py-2.5 font-medium text-ink">{c.name}</td><td className="num px-4 py-2.5">{c.avgKg} kg</td><td className="num px-4 py-2.5">{formatNpr(c.avgValue)}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
}
