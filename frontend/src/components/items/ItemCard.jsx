import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import SmartImage from '../ui/SmartImage';
import TypePill from '../ui/TypePill';
import StatusBadge from '../ui/StatusBadge';
import CircularityRing from '../ui/CircularityRing';
import SaveButton from './SaveButton';
import { priceLabel } from '../../lib/format';
import { fadeUp } from '../../lib/motion';

const MotionLink = motion.create(Link);

export default function ItemCard({ item, onSavedChange }) {
  const image = item.images?.[0];
  return (
    <motion.article variants={fadeUp} className="group relative">
      <MotionLink
        to={`/items/${item._id}`}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="block overflow-hidden rounded-card border border-line bg-surface shadow-soft transition-shadow duration-300 hover:shadow-lift"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <SmartImage
            src={image}
            alt={item.title}
            className="h-full w-full"
            imgClassName="transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
          <TypePill type={item.type} className="absolute left-3 top-3 shadow-soft" />
          {item.status && item.status !== 'active' && <StatusBadge status={item.status} className="absolute bottom-3 left-3 shadow-soft" />}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="line-clamp-2 font-sans text-[15px] font-semibold leading-snug tracking-normal text-ink">
              {item.title}
            </h3>
            <CircularityRing score={item.circularityScore} size={38} stroke={3.5} />
          </div>
          <p className="num mt-2 text-lg font-semibold text-forest-900">{priceLabel(item)}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-muted">
            <span>{item.condition}</span>
            <span aria-hidden>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
              {item.city}
            </span>
          </div>
        </div>
      </MotionLink>
      <SaveButton item={item} onChange={onSavedChange} className="absolute right-3 top-3" />
    </motion.article>
  );
}
