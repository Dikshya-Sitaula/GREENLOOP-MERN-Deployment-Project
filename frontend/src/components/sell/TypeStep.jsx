import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { TYPE_META } from '../../lib/listingTypes';

export default function TypeStep({ value, onChange, types = [] }) {
  return (
    <div>
      <h2 className="text-3xl tracking-tightest">How should it move on?</h2>
      <p className="mt-2 text-ink-muted">Pick the path that fits. You can change it later.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2" role="radiogroup" aria-label="Listing type">
        {types.map((t) => {
          const m = TYPE_META[t];
          const selected = value === t;
          return (
            <motion.button
              key={t}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.98 }}
              onClick={() => onChange(t)}
              className={`relative flex items-start gap-4 rounded-card border p-5 text-left transition ${selected ? 'border-forest-700 bg-forest-100/50 shadow-soft' : 'border-line bg-surface hover:border-ink/30'}`}
            >
              <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${m.pill}`}>
                <m.icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <span>
                <span className="block font-display text-xl">{m.verb}</span>
                <span className="mt-1 block text-sm text-ink-muted">{m.blurb}</span>
              </span>
              {selected && <Check className="absolute right-4 top-4 h-5 w-5 text-forest-700" strokeWidth={2} aria-hidden />}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
