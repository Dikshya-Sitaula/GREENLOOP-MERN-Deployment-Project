import TypePill from '../ui/TypePill';
import ScorePreview from './ScorePreview';
import { priceLabel } from '../../lib/format';

export default function ReviewStep({ form, photos }) {
  const price = priceLabel({ type: form.type, price: Number(form.price) });
  return (
    <div>
      <h2 className="text-3xl tracking-tightest">Ready to publish?</h2>
      <p className="mt-2 text-ink-muted">Here&apos;s how your listing will look.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="overflow-hidden rounded-card border border-line bg-surface">
          <div className="grid grid-cols-3 gap-0.5">
            {photos.slice(0, 3).map((p, i) => (
              <img key={p.preview} src={p.preview} alt={`Photo ${i + 1}`} className={`h-40 w-full object-cover ${i === 0 && photos.length === 1 ? 'col-span-3 h-64' : ''}`} />
            ))}
          </div>
          <div className="p-5">
            <TypePill type={form.type} />
            <h3 className="mt-3 text-2xl">{form.title}</h3>
            <p className="num mt-1 text-xl font-semibold text-forest-900">{price}</p>
            <p className="mt-2 text-sm text-ink-muted">{form.category} · {form.condition} · {form.city}</p>
            {form.type === 'swap' && (form.wantedCategory || form.wantedNote) && (
              <p className="mt-2 text-sm text-ink-muted">Looking for: <span className="font-medium text-ink">{[form.wantedCategory, form.wantedNote].filter(Boolean).join(' — ')}</span></p>
            )}
            <p className="mt-4 line-clamp-4 text-sm text-ink-muted">{form.description}</p>
          </div>
        </div>
        <ScorePreview category={form.category} condition={form.condition} type={form.type} />
      </div>
    </div>
  );
}
