import Field from '../ui/Field';
import ScorePreview from './ScorePreview';

export default function DetailsStep({ form, set, errors, meta }) {
  return (
    <div>
      <h2 className="text-3xl tracking-tightest">Tell us about it</h2>
      <p className="mt-2 text-ink-muted">Honest details build trust.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Field label="Title" maxLength={90} placeholder="e.g. Wooden study desk with drawer" value={form.title} onChange={set('title')} error={errors.title} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Category" as="select" value={form.category} onChange={set('category')} error={errors.category}>
              <option value="">Select…</option>
              {(meta?.categories || []).map((c) => <option key={c.name}>{c.name}</option>)}
            </Field>
            <Field label="Condition" as="select" value={form.condition} onChange={set('condition')} error={errors.condition}>
              <option value="">Select…</option>
              {(meta?.conditions || []).map((c) => <option key={c}>{c}</option>)}
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="City" as="select" value={form.city} onChange={set('city')} error={errors.city}>
              {(meta?.cities || []).map((c) => <option key={c}>{c}</option>)}
            </Field>
            {form.type === 'sell' && (
              <Field label="Price (NPR)" type="number" min="0" inputMode="numeric" placeholder="4500" value={form.price} onChange={set('price')} error={errors.price} />
            )}
            {form.type === 'repair' && (
              <Field label="What needs fixing?" maxLength={140} value={form.wantInReturn} onChange={set('wantInReturn')} error={errors.wantInReturn} />
            )}
            {form.type === 'swap' && (
              <Field label="Wanted category" as="select" value={form.wantedCategory} onChange={set('wantedCategory')} error={errors.wantedCategory} hint="Helps us match you with the right swaps">
                <option value="">Open to anything</option>
                {(meta?.categories || []).map((c) => <option key={c.name}>{c.name}</option>)}
              </Field>
            )}
          </div>
          {form.type === 'swap' && (
            <Field label="Note (optional)" maxLength={140} placeholder="e.g. A film camera or tripod" value={form.wantedNote} onChange={set('wantedNote')} error={errors.wantedNote} />
          )}
          <Field label="Description" as="textarea" maxLength={2000} placeholder="Age, size, why you're passing it on, pickup details…" value={form.description} onChange={set('description')} error={errors.description} />
        </div>
        <ScorePreview category={form.category} condition={form.condition} type={form.type} />
      </div>
    </div>
  );
}
