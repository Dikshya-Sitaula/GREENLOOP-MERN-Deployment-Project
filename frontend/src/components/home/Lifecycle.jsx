import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Sprout } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import CountUp from '../ui/CountUp';
import { TYPE_META } from '../../lib/listingTypes';
import { EASE } from '../../lib/motion';
import { formatNumber } from '../../lib/format';

const STOPS = ['sell', 'swap', 'donate', 'repair'];

function Stop({ type, lit, side }) {
  const meta = TYPE_META[type];
  const Icon = meta.icon;
  return (
    <motion.div
      className={`flex items-center gap-4 rounded-card border bg-surface p-4 transition-colors duration-500 ${side === 'right' ? 'lg:flex-row-reverse lg:text-right' : ''} ${lit ? 'border-forest-500/50 shadow-lift' : 'border-line shadow-soft'}`}
      animate={{ opacity: lit ? 1 : 0.5, scale: lit ? 1 : 0.98 }}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-500 ${lit ? meta.pill : 'bg-line/60 text-ink-muted'}`}>
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <div>
        <p className="font-display text-xl">{meta.label}</p>
        <p className="text-sm text-ink-muted">{meta.blurb}</p>
      </div>
    </motion.div>
  );
}

export default function Lifecycle({ item, impact }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-25% 0px' });
  const [step, setStep] = useState(0);

  // Lights each stop in sequence once the section scrolls into view.
  useEffect(() => {
    if (!inView) return undefined;
    const timers = [1, 2, 3, 4, 5].map((n) => setTimeout(() => setStep(n), n * 750));
    return () => timers.forEach(clearTimeout);
  }, [inView]);

  const avgKg = impact?.totals?.itemsReused ? impact.totals.kg / impact.totals.itemsReused : 0;
  const done = step >= 5;

  return (
    <section className="section bg-paper" ref={ref}>
      <div className="site-container">
        <SectionHeader center eyebrow="The item lifecycle" title="One item. Many second chances." sub="Every listing follows a loop. Pick the path that fits — each one keeps something out of the bin." />

        <div className="mt-14 grid items-center gap-5 lg:grid-cols-[1fr_320px_1fr] lg:gap-8">
          <div className="order-2 grid gap-4 lg:order-1">
            <Stop type={STOPS[0]} lit={step >= 1} side="left" />
            <Stop type={STOPS[1]} lit={step >= 2} side="left" />
          </div>

          <div className="relative order-1 mx-auto w-full max-w-[320px] lg:order-2">
            <svg viewBox="0 0 320 320" className="absolute -inset-6 h-[calc(100%+3rem)] w-[calc(100%+3rem)]" aria-hidden>
              <motion.circle cx="160" cy="160" r="156" fill="none" stroke="#3C7D61" strokeWidth="1.5" strokeLinecap="round" transform="rotate(-90 160 160)" initial={{ pathLength: 0 }} animate={{ pathLength: Math.min(step, 4) / 4 }} transition={{ duration: 0.75, ease: EASE }} />
              <circle cx="160" cy="160" r="156" fill="none" stroke="#E6E2D8" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
            <div className="relative overflow-hidden rounded-card border border-line bg-surface p-2 shadow-lift">
              {item ? (
                <>
                  <SmartImage src={item.images?.[0]} alt={item.title} className="aspect-square rounded-lg" />
                  <div className="p-3">
                    <p className="line-clamp-1 font-semibold">{item.title}</p>
                    <p className="text-xs text-ink-muted">{item.condition} · {item.city}</p>
                  </div>
                </>
              ) : (
                <div className="aspect-square animate-pulse rounded-lg bg-line/60" />
              )}
            </div>
          </div>

          <div className="order-3 grid gap-4">
            <Stop type={STOPS[2]} lit={step >= 3} side="right" />
            <Stop type={STOPS[3]} lit={step >= 4} side="right" />
          </div>
        </div>

        <motion.div
          className={`mx-auto mt-10 flex max-w-2xl flex-col items-center gap-3 rounded-card border px-6 py-6 text-center transition-colors duration-700 sm:flex-row sm:text-left ${done ? 'border-forest-700 bg-forest-900 text-white' : 'border-line bg-surface text-ink-muted'}`}
          animate={{ opacity: done ? 1 : 0.6 }}
        >
          <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${done ? 'bg-marigold text-ink' : 'bg-line/60'}`}>
            <Sprout className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className={`font-display text-2xl ${done ? 'text-white' : ''}`}>Second life</p>
            <p className="text-sm">
              {done && avgKg > 0 ? (
                <>
                  On average, each completed item keeps about <strong className="text-marigold"><CountUp value={avgKg} format={(n) => formatNumber(n, 1)} /> kg</strong> in use (estimated).
                </>
              ) : (
                'The loop closes when someone else gives it a new chapter.'
              )}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
