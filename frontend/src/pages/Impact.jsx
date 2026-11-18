import { useState } from 'react';
import { Info, Package, Recycle, Banknote, Repeat2, Gift } from 'lucide-react';
import { fetchGlobalImpact, fetchMyImpact } from '../api/community';
import { useAuth } from '../context/AuthContext';
import { useAsync, usePageTitle } from '../lib/hooks';
import { formatNpr, formatNumber } from '../lib/format';
import CountUp from '../components/ui/CountUp';
import Button from '../components/ui/Button';
import { ErrorState, Skeleton } from '../components/ui/States';
import { StaggerGroup, StaggerItem } from '../components/ui/Reveal';
import { ActionDonut, MonthlyChart } from '../components/impact/ImpactCharts';
import LevelCard from '../components/impact/LevelCard';
import AssumptionsModal from '../components/impact/AssumptionsModal';

function Stat({ icon: Icon, label, value, format }) {
  return (
    <StaggerItem className="rounded-card border border-line bg-surface p-5 shadow-soft">
      <Icon className="h-5 w-5 text-forest-500" strokeWidth={1.5} />
      <p className="mt-4 font-display text-4xl tracking-tightest text-forest-900"><CountUp value={value} format={format} /></p>
      <p className="mt-1 text-sm text-ink-muted">{label}</p>
    </StaggerItem>
  );
}

export default function Impact() {
  usePageTitle('Impact');
  const { user } = useAuth();
  const [scope, setScope] = useState(user ? 'me' : 'global');
  const [modal, setModal] = useState(false);
  const { data, loading, error, reload } = useAsync(() => (scope === 'me' ? fetchMyImpact() : fetchGlobalImpact()), [scope]);
  const t = data?.totals;

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <div className="site-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Impact</p>
            <h1 className="mt-2 text-4xl tracking-tightest md:text-5xl">{scope === 'me' ? 'Your impact' : 'Community impact'}</h1>
            <p className="mt-3 max-w-xl text-ink-muted">Every completed listing keeps something in use. All figures are estimates.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user && (
              <div className="inline-flex rounded-full border border-line bg-surface p-1" role="group" aria-label="Impact scope">
                {[['me', 'Me'], ['global', 'Community']].map(([k, l]) => (
                  <button key={k} type="button" aria-pressed={scope === k} onClick={() => setScope(k)} className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${scope === k ? 'bg-forest-700 text-white' : 'text-ink-muted hover:text-ink'}`}>{l}</button>
                ))}
              </div>
            )}
            <Button variant="outline" size="sm" onClick={() => setModal(true)}><Info className="h-4 w-4" strokeWidth={1.5} /> How we calculate</Button>
          </div>
        </div>

        {error ? (
          <ErrorState className="mt-10" message={error.message} onRetry={reload} />
        ) : loading || !t ? (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-36" />)}</div>
        ) : (
          <>
            <StaggerGroup key={scope} className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Stat icon={Package} label="Items reused" value={t.itemsReused} />
              <Stat icon={Recycle} label="kg diverted (est.)" value={t.kg} format={(n) => formatNumber(n, 1)} />
              <Stat icon={Banknote} label="Rs. circulated (est.)" value={t.valueNpr} format={formatNpr} />
              <Stat icon={Repeat2} label="Swaps" value={t.swaps} />
              <Stat icon={Gift} label="Donations" value={t.donations} />
            </StaggerGroup>

            {t.itemsReused === 0 && scope === 'me' && (
              <p className="mt-6 rounded-card border border-dashed border-line bg-surface/60 p-6 text-center text-sm text-ink-muted">
                Nothing completed yet. Mark a listing as completed and your numbers will appear here.
              </p>
            )}

            <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
              <div className="rounded-card border border-line bg-surface p-6 shadow-soft">
                <h2 className="text-2xl">Last 6 months</h2>
                <p className="mb-4 text-sm text-ink-muted">Kilograms diverted per month (estimated)</p>
                <MonthlyChart data={data.monthly} />
              </div>
              <div className="rounded-card border border-line bg-surface p-6 shadow-soft">
                <h2 className="text-2xl">By action</h2>
                <p className="mb-4 text-sm text-ink-muted">How items found a second life</p>
                <ActionDonut data={data.byAction} />
              </div>
            </div>

            {data.level && <div className="mt-6"><LevelCard level={data.level} badges={data.badges} /></div>}
          </>
        )}
        <p className="mt-8 text-xs text-ink-muted">Demo data. Estimates use average item weights and values per category.</p>
      </div>
      <AssumptionsModal open={modal} onClose={() => setModal(false)} />
    </section>
  );
}
