import { Compass, Hammer, Heart, Lightbulb, Recycle, ShieldCheck, Users } from 'lucide-react';
import SectionHeader from '../components/ui/SectionHeader';
import Reveal, { StaggerGroup, StaggerItem } from '../components/ui/Reveal';
import Button from '../components/ui/Button';
import { TYPE_META } from '../lib/listingTypes';
import { usePageTitle } from '../lib/hooks';

const VALUES = [
  { icon: Recycle, title: 'Reuse first', text: 'The most sustainable item is the one that already exists.' },
  { icon: Users, title: 'Neighbours over strangers', text: 'Local, city-by-city exchange keeps things human and trustworthy.' },
  { icon: ShieldCheck, title: 'Honest numbers', text: 'Every impact figure is labelled as an estimate, with assumptions you can read.' },
  { icon: Heart, title: 'Dignity in giving', text: 'Donating and repairing deserve the same care as selling.' },
];

const STORY = [
  {
    icon: Lightbulb,
    title: 'The Idea',
    text: 'It started the way her projects usually do: with a small, stubborn question. Why does something perfectly useful sit unused while someone nearby is searching for it? Instead of leaving it as a passing thought, she gave it a name and a plan. That question became GreenLoop.',
  },
  {
    icon: Hammer,
    title: 'The Builder',
    text: 'Theory gives her the why; building shows her whether it actually works. So she learns with her hands on the keyboard, trying things, breaking them, fixing them and trying again, until an idea turns into something people can use.',
  },
  {
    icon: Compass,
    title: 'The Vision',
    text: 'Dikshya wants to create technology that is practical before it is impressive: tools that help people reuse more, waste less and trust the numbers they see. GreenLoop is one step on that path, and her curiosity is only getting started.',
  },
];

export default function About() {
  usePageTitle('About');
  return (
    <>
      <section className="bg-forest-900 pb-20 pt-32 text-white md:pb-28 md:pt-44">
        <div className="site-container max-w-4xl">
          <p className="eyebrow !text-forest-100/80">About GreenLoop</p>
          <h1 className="mt-4 text-5xl leading-[1.02] tracking-tightest md:text-7xl">Things deserve more than one chapter.</h1>
          <p className="mt-6 max-w-2xl text-lg text-white/70">
            GreenLoop is a circular marketplace for Nepal, built so that selling, swapping, donating and repairing is the easy choice.
          </p>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="site-container grid gap-12 md:grid-cols-2">
          <Reveal>
            <p className="eyebrow">The problem</p>
            <h2 className="mt-3 text-4xl tracking-tightest">Useful things end up as waste.</h2>
            <p className="mt-4 text-ink-muted">
              Working laptops sit in drawers, sturdy furniture is thrown out over one loose screw, and good books gather dust. Meanwhile someone nearby is looking for exactly that.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our mission</p>
            <h2 className="mt-3 text-4xl tracking-tightest">Make the second life the first choice.</h2>
            <p className="mt-4 text-ink-muted">
              We connect people across Kathmandu, Lalitpur, Bhaktapur and Pokhara, and show the estimated difference each exchange makes.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="site-container">
          <SectionHeader center eyebrow="The loop" title="Four ways to keep it going" />
          <StaggerGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(TYPE_META).map(([key, m]) => (
              <StaggerItem key={key} className="rounded-card border border-line bg-paper p-6">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full ${m.pill}`}>
                  <m.icon className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <h3 className="mt-5 text-2xl">{m.label}</h3>
                <p className="mt-2 text-sm text-ink-muted">{m.blurb}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="section bg-paper">
        <div className="site-container">
          <SectionHeader eyebrow="Values" title="What we stand for" />
          <StaggerGroup className="mt-12 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {VALUES.map(({ icon: Icon, title, text }) => (
              <StaggerItem key={title} className="flex gap-4 border-t border-line pt-6">
                <Icon className="mt-1 h-6 w-6 shrink-0 text-forest-700" strokeWidth={1.5} />
                <div>
                  <h3 className="text-xl">{title}</h3>
                  <p className="mt-1.5 text-ink-muted">{text}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </section>

      <section className="section bg-surface">
        <div className="site-container grid items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal className="mx-auto w-full max-w-sm lg:sticky lg:top-28 lg:max-w-none">
            <figure className="relative overflow-hidden rounded-card border border-line bg-paper shadow-lift">
              <img
                src="/dikshya-sitaula.jpg"
                alt="Dikshya Sitaula, creator of GreenLoop, standing in front of a colourful patchwork tapestry beside a glowing lantern"
                className="aspect-[4/5] w-full object-cover object-[50%_62%]"
                loading="lazy"
              />
              <figcaption className="absolute inset-x-3 bottom-3 rounded-xl border border-white/20 bg-ink/75 px-4 py-3 text-white backdrop-blur-sm">
                <p className="font-display text-xl leading-tight">Dikshya Sitaula</p>
                <p className="mt-0.5 text-xs text-white/75">2nd Year, 3rd Semester</p>
              </figcaption>
            </figure>
          </Reveal>

          <div>
            <Reveal>
              <p className="eyebrow">Meet the creator</p>
              <h2 className="mt-3 text-4xl leading-tight tracking-tightest md:text-5xl">Dikshya Sitaula</h2>
              <p className="mt-2 text-sm font-medium text-forest-700">AI &amp; Data Science Student · Web App &amp; Idea Creator</p>
              <p className="mt-6 font-display text-2xl leading-snug text-ink md:text-3xl">
                Every idea starts with a question. For Dikshya, that question tends to turn into a project.
              </p>
            </Reveal>

            <StaggerGroup className="mt-10 space-y-8">
              {STORY.map(({ icon: Icon, title, text }) => (
                <StaggerItem key={title} className="flex gap-4 border-t border-line pt-6">
                  <Icon className="mt-1 h-6 w-6 shrink-0 text-forest-700" strokeWidth={1.5} />
                  <div>
                    <h3 className="text-xl">{title}</h3>
                    <p className="mt-1.5 text-ink-muted">{text}</p>
                  </div>
                </StaggerItem>
              ))}
            </StaggerGroup>

            <div className="mt-10">
              <Button to="/explore" variant="accent" size="lg">Explore items</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
