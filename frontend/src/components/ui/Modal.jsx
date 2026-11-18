import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { EASE } from '../../lib/motion';

export default function Modal({ open, onClose, title, children, size = 'max-w-lg' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" aria-label="Close dialog" className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`relative max-h-[90vh] w-full ${size} overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-lift sm:rounded-2xl sm:p-8`}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 0.4, ease: EASE } }}
            exit={{ y: 24, opacity: 0, transition: { duration: 0.2 } }}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <h2 className="text-2xl">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="-mr-2 -mt-1 rounded-full p-2 text-ink-muted transition hover:bg-ink/5 hover:text-ink"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
