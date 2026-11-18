import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { EASE } from '../../lib/motion';

export default function LevelCard({ level, badges }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-soft">
      <p className="eyebrow">Your level</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <h3 className="text-3xl tracking-tightest">{level.name}</h3>
        <span className="num text-sm text-ink-muted">{level.points} pts</span>
      </div>
      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={level.progress} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to next level">
        <motion.div className="h-full rounded-full bg-forest-700" initial={{ width: 0 }} whileInView={{ width: `${level.progress}%` }} viewport={{ once: true }} transition={{ duration: 1.1, ease: EASE }} />
      </div>
      <p className="mt-2 text-xs text-ink-muted">{level.next ? <><span className="num">{level.nextAt - level.points}</span> points to {level.next}</> : 'You reached the top level.'}</p>

      <ol className="mt-5 flex flex-wrap gap-1.5">
        {level.all.map((l, i) => (
          <li key={l.name} className={`rounded-full px-2.5 py-1 text-xs font-medium ${i <= level.index ? 'bg-forest-100 text-forest-700' : 'bg-line/60 text-ink-muted'}`}>{l.name}</li>
        ))}
      </ol>

      <h4 className="mt-7 font-sans text-sm font-semibold">Badges</h4>
      <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {badges.map((b) => (
          <li key={b.key} className={`rounded-lg border p-3 ${b.earned ? 'border-marigold/40 bg-marigold-100' : 'border-line bg-paper opacity-60'}`} title={b.description}>
            {b.earned ? <Award className="h-5 w-5 text-[#8A5A12]" strokeWidth={1.5} /> : <Lock className="h-5 w-5 text-ink-muted" strokeWidth={1.5} />}
            <p className="mt-2 text-sm font-semibold">{b.name}</p>
            <p className="text-xs text-ink-muted">{b.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
