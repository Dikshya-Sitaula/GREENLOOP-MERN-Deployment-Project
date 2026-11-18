import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, Search, X, PackageSearch } from 'lucide-react';
import { fetchItems } from '../api/items';
import { useMeta } from '../api/meta';
import { useAsync, usePageTitle } from '../lib/hooks';
import ItemGrid from '../components/items/ItemGrid';
import FilterPanel from '../components/items/FilterPanel';
import Pagination from '../components/items/Pagination';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const SORTS = [
  ['newest', 'Newest'],
  ['price_asc', 'Price: low to high'],
  ['price_desc', 'Price: high to low'],
  ['score', 'Highest circularity'],
];

function readParams(sp) {
  return {
    q: sp.get('q') || '',
    category: sp.getAll('category'),
    type: sp.getAll('type'),
    condition: sp.getAll('condition'),
    city: sp.get('city') || '',
    minPrice: sp.get('minPrice') || '',
    maxPrice: sp.get('maxPrice') || '',
    sort: sp.get('sort') || 'newest',
    page: Number(sp.get('page')) || 1,
  };
}

function writeParams(p) {
  const sp = new URLSearchParams();
  Object.entries(p).forEach(([k, v]) => {
    if (Array.isArray(v)) v.forEach((x) => sp.append(k, x));
    else if (v && !(k === 'sort' && v === 'newest') && !(k === 'page' && v === 1)) sp.set(k, v);
  });
  return sp;
}

export default function Explore() {
  usePageTitle('Explore');
  const meta = useMeta();
  const [sp, setSp] = useSearchParams();
  const params = useMemo(() => readParams(sp), [sp]);
  const [search, setSearch] = useState(params.q);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => setSearch(params.q), [params.q]);

  const update = (patch, resetPage = true) => setSp(writeParams({ ...params, ...patch, ...(resetPage ? { page: 1 } : {}) }), { replace: true });

  const { data, loading, error, reload } = useAsync(() => fetchItems({ ...params, limit: 12 }), [sp.toString()]);

  const filters = { category: params.category, type: params.type, condition: params.condition, city: params.city, minPrice: params.minPrice, maxPrice: params.maxPrice };
  const activeCount = params.category.length + params.type.length + params.condition.length + [params.city, params.minPrice, params.maxPrice].filter(Boolean).length;
  const clearAll = () => setSp(writeParams({ ...params, category: [], type: [], condition: [], city: '', minPrice: '', maxPrice: '', q: '', page: 1 }), { replace: true });

  return (
    <section className="bg-paper pb-24 pt-28 md:pt-36">
      <div className="site-container">
        <p className="eyebrow">Explore</p>
        <h1 className="mt-2 text-4xl tracking-tightest md:text-5xl">Find your next find</h1>

        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(e) => {
            e.preventDefault();
            update({ q: search.trim() });
          }}
          role="search"
        >
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" strokeWidth={1.5} />
            <input className="input h-11 pl-10" type="search" placeholder="Search bicycles, books, sofas…" value={search} onChange={(e) => setSearch(e.target.value)} aria-label="Search items" />
          </div>
          <div className="flex gap-3">
            <select className="input h-11 flex-1 sm:w-52 sm:flex-none" value={params.sort} onChange={(e) => update({ sort: e.target.value })} aria-label="Sort by">
              {SORTS.map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
            <Button type="button" variant="outline" className="lg:hidden" onClick={() => setDrawer(true)}>
              <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} /> Filters{activeCount ? ` (${activeCount})` : ''}
            </Button>
          </div>
        </form>

        <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label="Filters">
            <div className="sticky top-24 rounded-card border border-line bg-surface p-5">
              <FilterPanel filters={filters} onChange={(f) => update(f)} meta={meta} />
              {activeCount > 0 && (
                <button type="button" onClick={clearAll} className="mt-2 text-sm font-medium text-forest-700 hover:underline">Clear all filters</button>
              )}
            </div>
          </aside>

          <div>
            <p className="mb-5 text-sm text-ink-muted" aria-live="polite">
              {loading ? 'Searching…' : error ? '' : <><span className="num font-semibold text-ink">{data?.total ?? 0}</span> {data?.total === 1 ? 'item' : 'items'}{params.q && <> for “{params.q}”</>}</>}
            </p>
            <ItemGrid
              items={data?.items}
              loading={loading}
              error={error}
              onRetry={reload}
              skeletons={6}
              className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-3"
              empty={{
                icon: PackageSearch,
                title: 'Nothing matches yet',
                message: 'Try fewer filters, or list something so someone else can find it.',
                action: <Button variant="outline" onClick={clearAll}><X className="h-4 w-4" strokeWidth={1.5} /> Clear filters</Button>,
              }}
            />
            {!loading && !error && <Pagination page={data?.page || 1} pages={data?.pages || 1} onChange={(p) => { update({ page: p }, false); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
          </div>
        </div>
      </div>

      <Modal open={drawer} onClose={() => setDrawer(false)} title="Filters">
        <FilterPanel filters={filters} onChange={(f) => update(f)} meta={meta} />
        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={clearAll}>Clear</Button>
          <Button className="flex-1" onClick={() => setDrawer(false)}>Show {data?.total ?? ''} items</Button>
        </div>
      </Modal>
    </section>
  );
}
