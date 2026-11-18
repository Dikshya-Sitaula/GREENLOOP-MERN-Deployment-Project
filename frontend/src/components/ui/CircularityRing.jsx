import { motion } from 'framer-motion';
import { BAND_COLOR } from '../../lib/listingTypes';
import { EASE } from '../../lib/motion';

const bandOf = (score) => (score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Moderate' : 'Low');

export default function CircularityRing({ score = 0, size = 40, stroke = 4, showLabel = false, className = '' }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const band = bandOf(score);
  const color = BAND_COLOR[band];
  return (
    <div className={`inline-flex items-center gap-2 ${className}`} title={`Circularity Score ${score}/100 · ${band}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E6E2D8" strokeWidth={stroke} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            whileInView={{ strokeDashoffset: c * (1 - score / 100) }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: EASE }}
          />
        </svg>
        <span
          className="num absolute inset-0 flex items-center justify-center font-semibold text-ink"
          style={{ fontSize: Math.max(10, size * 0.3) }}
        >
          {score}
        </span>
      </div>
      {showLabel && (
        <div className="leading-tight">
          <p className="text-sm font-semibold" style={{ color }}>
            {band}
          </p>
          <p className="text-xs text-ink-muted">Circularity Score</p>
        </div>
      )}
      <span className="sr-only">Circularity Score {score} out of 100, {band}</span>
    </div>
  );
}
