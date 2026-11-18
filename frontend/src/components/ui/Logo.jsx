import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { EASE } from '../../lib/motion';

export function LoopMark({ className = 'h-8 w-8', light = false }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="9" fill={light ? '#E2EEE7' : '#0F3B2C'} />
      <motion.circle
        cx="16"
        cy="16"
        r="8.5"
        fill="none"
        stroke={light ? '#0F3B2C' : '#E2EEE7'}
        strokeWidth="2.2"
        strokeLinecap="round"
        transform="rotate(-60 16 16)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 0.84 }}
        transition={{ duration: 1.4, ease: EASE }}
      />
      <motion.circle
        cx="22.5"
        cy="10.6"
        r="2.2"
        fill="#E9A23B"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.1, duration: 0.4, ease: EASE }}
      />
    </svg>
  );
}

export default function Logo({ light = false }) {
  return (
    <Link to="/" className="group inline-flex items-center gap-2.5 rounded-lg" aria-label="GreenLoop home">
      <LoopMark light={light} />
      <span className={`font-display text-[1.35rem] font-medium tracking-tight ${light ? 'text-white' : 'text-ink'}`}>
        GreenLoop
      </span>
    </Link>
  );
}
