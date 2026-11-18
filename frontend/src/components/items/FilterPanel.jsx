import { TYPE_META } from '../../lib/listingTypes';
import CategoryIcon from '../../lib/categoryIcons';

const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-0">
      <legend className="mb-3 text-sm font-semibold">{title}</legend>
      {children}
    </fieldset>
  );
}

function Check({ checked, onChange, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-ink">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded border-line accent-forest-700" />
      {children}
    </label>
  );
}

// filters: { category[], type[], condition[], city, minPrice, maxPrice }
export default function FilterPanel({ filters, onChange, meta }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  return (
    <div>
      <Group title="Type">
        {(meta?.types || []).map((t) => (
          <Check key={t} checked={filters.type.includes(t)} onChange={() => set({ type: toggle(filters.type, t) })}>
            {TYPE_META[t].label}
          </Check>
        ))}
      </Group>
      <Group title="Category">
        <div className="max-h-72 overflow-y-auto pr-1">
          {(meta?.categories || []).map((c) => (
            <Check key={c.name} checked={filters.category.includes(c.name)} onChange={() => set({ category: toggle(filters.category, c.name) })}>
              <CategoryIcon name={c.icon} className="h-4 w-4 shrink-0 text-ink-muted" />
              <span className="flex-1">{c.name}</span>
              <span className="num text-xs text-ink-muted">{c.count}</span>
            </Check>
          ))}
        </div>
      </Group>
      <Group title="Condition">
        {(meta?.conditions || []).map((c) => (
          <Check key={c} checked={filters.condition.includes(c)} onChange={() => set({ condition: toggle(filters.condition, c) })}>
            {c}
          </Check>
        ))}
      </Group>
      <Group title="City">
        <select className="input" value={filters.city} onChange={(e) => set({ city: e.target.value })} aria-label="City">
          <option value="">All cities</option>
          {(meta?.cities || []).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Group>
      <Group title="Price (NPR)">
        <div className="flex items-center gap-2">
          <input type="number" min="0" inputMode="numeric" placeholder="Min" aria-label="Minimum price" className="input num" value={filters.minPrice} onChange={(e) => set({ minPrice: e.target.value })} />
          <span className="text-ink-muted">–</span>
          <input type="number" min="0" inputMode="numeric" placeholder="Max" aria-label="Maximum price" className="input num" value={filters.maxPrice} onChange={(e) => set({ maxPrice: e.target.value })} />
        </div>
      </Group>
    </div>
  );
}
