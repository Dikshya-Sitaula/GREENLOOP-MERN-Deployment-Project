import { Skeleton } from '../ui/States';
import CountUp from '../ui/CountUp';
import { formatNpr } from '../../lib/format';

export default function TrustStrip({ impact, cityCount, loading }) {
  const t = impact?.totals;
  const stats = t && [
    { label: 'Active listings', value: t.activeListings },
    { label: 'Members', value: t.members },
    { label: 'Cities', value: cityCount },
    { label: 'Circulated (est.)', value: t.valueNpr, format: (n) => formatNpr(n) },
  ];
  return (
    <section className="border-b border-line bg-surface" aria-label="Community at a glance">
      <div className="site-container grid grid-cols-2 gap-y-6 py-7 md:grid-cols-4 md:py-8">
        {loading || !stats
          ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="mx-auto h-10 w-32" />)
          : stats.map((s) => (
              <div key={s.label} className="text-center md:border-r md:border-line md:last:border-0">
                <p className="font-display text-3xl tracking-tightest text-forest-900">
                  <CountUp value={s.value} format={s.format} />
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-wider text-ink-muted">{s.label}</p>
              </div>
            ))}
      </div>
    </section>
  );
}
