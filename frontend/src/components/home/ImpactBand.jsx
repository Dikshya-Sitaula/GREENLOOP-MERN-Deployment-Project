import { ArrowRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import CountUp from '../ui/CountUp';
import Button from '../ui/Button';
import { ErrorState, Skeleton } from '../ui/States';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';
import { formatNpr, formatNumber } from '../../lib/format';

export default function ImpactBand({ impact, loading, error, onRetry }) {
  const t = impact?.totals;
  const stats = t && [
    { label: 'items given another life', value: t.itemsReused },
    { label: 'kg kept in use', value: t.kg, format: (n) => formatNumber(n, 0) },
    { label: 'circulated in NPR', value: t.valueNpr, format: formatNpr },
    { label: 'swaps and donations', value: t.swaps + t.donations },
  ];
  return (
    <section className="section bg-forest-100">
      <div className="site-container">
        <SectionHeader
          eyebrow="Community impact"
          title="Small loops add up."
          sub="Live totals from every completed listing on GreenLoop."
          action={<Button to="/impact" variant="primary">See full impact <ArrowRight className="h-4 w-4" strokeWidth={1.5} /></Button>}
        />
        {error ? (
          <ErrorState className="mt-12" message={error.message} onRetry={onRetry} />
        ) : (
          <StaggerGroup className="mt-14 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4" step={0.1}>
            {loading || !stats
              ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28" />)
              : stats.map((s) => (
                  <StaggerItem key={s.label} className="border-t border-forest-700/30 pt-5">
                    <p className="whitespace-nowrap font-display text-5xl leading-none tracking-tightest text-forest-900 sm:text-4xl lg:text-[2.6rem]">
                      <CountUp value={s.value} format={s.format} />
                    </p>
                    <p className="mt-3 text-sm font-medium text-forest-700">{s.label}</p>
                  </StaggerItem>
                ))}
          </StaggerGroup>
        )}
        <p className="mt-10 text-xs text-forest-700/80">
          These are estimates based on average item weights and values per category. Demo data.
        </p>
      </div>
    </section>
  );
}
