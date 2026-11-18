import { motion } from 'framer-motion';
import Logo, { LoopMark } from '../ui/Logo';
import SmartImage from '../ui/SmartImage';
import { EASE } from '../../lib/motion';

const AUTH_IMAGE =
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80&auto=format&fit=crop';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col px-5 py-8 sm:px-10 lg:px-16">
        <Logo />
        <motion.div
          className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } }}
        >
          <h1 className="text-4xl tracking-tightest">{title}</h1>
          <p className="mt-2 text-ink-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <div className="mt-8 text-sm text-ink-muted">{footer}</div>
        </motion.div>
      </div>

      <aside className="relative hidden overflow-hidden bg-forest-900 lg:block" aria-hidden>
        <SmartImage src={AUTH_IMAGE} alt="" className="absolute inset-0" imgClassName="opacity-70" eager />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-900 via-forest-900/40 to-forest-900/10" />
        <div className="absolute inset-x-0 bottom-0 p-14 text-white">
          <LoopMark light className="h-10 w-10" />
          <p className="mt-6 max-w-sm font-display text-4xl leading-tight tracking-tightest">
            Someone else might need what you no longer do.
          </p>
          <p className="mt-3 text-sm text-white/70">Reuse. Swap. Repair. Repeat.</p>
        </div>
      </aside>
    </div>
  );
}
