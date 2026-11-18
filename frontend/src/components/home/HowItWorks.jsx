import { Camera, Handshake, LineChart } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';

const STEPS = [
  { icon: Camera, title: 'List it in minutes', text: 'Add photos, pick Sell, Swap, Donate or Repair, and get an instant Circularity Score.' },
  { icon: Handshake, title: 'Connect nearby', text: 'Neighbours across Kathmandu, Lalitpur, Bhaktapur and Pokhara save, offer swaps and reach out.' },
  { icon: LineChart, title: 'Watch the impact grow', text: 'Mark it completed and your estimated kilograms diverted and rupees circulated update.' },
];

export default function HowItWorks() {
  return (
    <section className="section bg-surface">
      <div className="site-container grid gap-14 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <SectionHeader eyebrow="How it works" title="Three steps. No landfill." sub="Reuse. Swap. Repair. Repeat." />
        <StaggerGroup className="relative space-y-8" step={0.12}>
          <div className="absolute bottom-6 left-[23px] top-6 w-px bg-line" aria-hidden />
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <StaggerItem key={title} className="relative flex gap-5">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-paper text-forest-700">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div className="pt-1">
                <p className="num text-xs font-semibold uppercase tracking-widest text-ink-muted">Step {i + 1}</p>
                <h3 className="mt-1 text-2xl">{title}</h3>
                <p className="mt-2 max-w-md text-ink-muted">{text}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
