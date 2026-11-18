import Reveal from './Reveal';

export default function SectionHeader({ eyebrow, title, sub, center = false, light = false, action }) {
  return (
    <Reveal className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${center ? 'items-center text-center md:flex-col md:items-center' : ''}`}>
      <div className={center ? 'mx-auto max-w-2xl' : 'max-w-2xl'}>
        {eyebrow && <p className={`eyebrow ${light ? '!text-forest-100/80' : ''}`}>{eyebrow}</p>}
        <h2 className={`mt-3 text-4xl leading-[1.08] tracking-tightest md:text-5xl ${light ? 'text-white' : 'text-ink'}`}>{title}</h2>
        {sub && <p className={`mt-4 text-base leading-relaxed md:text-lg ${light ? 'text-white/70' : 'text-ink-muted'}`}>{sub}</p>}
      </div>
      {action}
    </Reveal>
  );
}
