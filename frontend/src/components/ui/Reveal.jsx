import { motion } from 'framer-motion';
import { fadeUp, stagger } from '../../lib/motion';

// Fades + slides children up 24px once when scrolled into view.
export default function Reveal({ as = 'div', children, className = '', delay = 0, ...rest }) {
  const Tag = motion[as];
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={{ hidden: fadeUp.hidden, show: { ...fadeUp.show, transition: { ...fadeUp.show.transition, delay } } }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StaggerGroup({ as = 'div', children, className = '', step = 0.06 }) {
  const Tag = motion[as];
  return (
    <Tag className={className} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={stagger(step)}>
      {children}
    </Tag>
  );
}

export function StaggerItem({ as = 'div', children, className = '' }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp}>
      {children}
    </Tag>
  );
}
