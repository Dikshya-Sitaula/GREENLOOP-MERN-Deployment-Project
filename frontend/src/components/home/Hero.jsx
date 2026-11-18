import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import TypePill from '../ui/TypePill';
import { Link } from 'react-router-dom';
import { EASE } from '../../lib/motion';
import { priceLabel } from '../../lib/format';

const POSITIONS = [
  'left-0 top-[2%] w-40 sm:w-44',
  'right-0 top-[30%] w-40 sm:w-44',
  'bottom-0 left-[8%] w-40 sm:w-44',
];

function FloatingCard({ item, className, delay }) {
  return (
    <motion.div
      className={`absolute ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 + delay, duration: 0.8, ease: EASE }}
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 7 + delay * 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Link to={`/items/${item._id}`} className="block overflow-hidden rounded-card bg-surface p-2 shadow-lift transition-transform hover:-translate-y-1">
          <SmartImage src={item.images?.[0]} alt={item.title} className="aspect-[16/10] rounded-lg" eager />
          <div className="px-1.5 pb-1.5 pt-2.5">
            <TypePill type={item.type} />
            <p className="mt-2 line-clamp-1 text-[13px] font-semibold text-ink">{item.title}</p>
            <p className="num text-sm font-semibold text-forest-700">{priceLabel(item)}</p>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

function LoopArt() {
  return (
    <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden>
      <motion.circle
        cx="200" cy="200" r="150" fill="none" stroke="#3C7D61" strokeWidth="1.5" strokeLinecap="round"
        transform="rotate(-90 200 200)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 0.92 }}
        transition={{ duration: 2.6, ease: EASE }}
      />
      <motion.circle
        cx="200" cy="200" r="190" fill="none" stroke="#E2EEE7" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="2 8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1.2 }}
      />
      <motion.circle cx="200" cy="50" r="7" fill="#E9A23B" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, duration: 0.5, ease: EASE }} />
    </svg>
  );
}

export default function Hero({ items = [] }) {
  return (
    <section className="relative overflow-hidden bg-forest-900 pb-20 pt-32 text-white md:pb-28 md:pt-44">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[700px] w-[900px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(60,125,97,0.38),transparent)]" aria-hidden />
      <div className="site-container relative grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.p className="eyebrow !text-forest-100/80" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }}>
            Nepal&apos;s circular marketplace
          </motion.p>
          <motion.h1
            className="mt-5 text-[3rem] leading-[0.98] tracking-tightest sm:text-7xl lg:text-[5.5rem]"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
          >
            Give Things <span className="italic text-forest-100">Another Life.</span>
          </motion.h1>
          <motion.p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.25, ease: EASE }}>
            Buy, sell, swap, donate or repair — and see the difference it makes.
          </motion.p>
          <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4, ease: EASE }}>
            <Button to="/explore" variant="accent" size="lg">
              Explore items <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
            </Button>
            <Button to="/sell" variant="outline-light" size="lg">
              List an item
            </Button>
          </motion.div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-[460px]" aria-label="Featured listings">
          <LoopArt />
          {items.slice(0, 3).map((item, i) => (
            <FloatingCard key={item._id} item={item} className={POSITIONS[i]} delay={i * 0.18} />
          ))}
        </div>
      </div>
    </section>
  );
}
