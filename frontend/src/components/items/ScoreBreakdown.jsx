import { motion } from 'framer-motion';
import CircularityRing from '../ui/CircularityRing';
import { BAND_COLOR } from '../../lib/listingTypes';
import { EASE } from '../../lib/motion';

const LABELS = {
  condition: 'Condition',
  longevity: 'Category longevity',
  repairability: 'Repairability',
  demand: 'Reuse demand',
  type: 'Pass-it-on bonus',
};

// breakdown: { condition: 20, ... }, max: { condition: 30, ... } (both from the API)
export default function ScoreBreakdown({ score, band, breakdown = {}, max = {} }) {
  return (
    <div className="rounded-card border border-line bg-surface p-5">
      <div className="flex items-center justify-between gap-4">
        <CircularityRing score={score} size={64} stroke={6} showLabel />
        <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: BAND_COLOR[band] }}>
          {band}
        </span>
      </div>
      <ul className="mt-5 space-y-3">
        {Object.keys(LABELS).map((key) => (
          <li key={key}>
            <div className="flex justify-between text-xs">
              <span className="text-ink-muted">{LABELS[key]}</span>
              <span className="num font-medium">{breakdown[key] ?? 0}/{max[key] ?? '–'}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
              <motion.div
                className="h-full rounded-full bg-forest-500"
                initial={{ width: 0 }}
                whileInView={{ width: `${max[key] ? ((breakdown[key] ?? 0) / max[key]) * 100 : 0}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: EASE }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
