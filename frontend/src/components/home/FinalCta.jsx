import Reveal from '../ui/Reveal';
import Button from '../ui/Button';

export default function FinalCta() {
  return (
    <section className="relative overflow-hidden bg-forest-900 py-24 text-center text-white md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(60,125,97,0.35),transparent)]" aria-hidden />
      <Reveal className="site-container relative">
        <p className="eyebrow !text-forest-100/80">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-3xl text-5xl leading-[1.02] tracking-tightest md:text-7xl">
          Your old desk just found its next chapter.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-white/70">Someone else might need what you no longer do.</p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button to="/sell" variant="accent" size="lg">List an item</Button>
          <Button to="/explore" variant="outline-light" size="lg">Explore items</Button>
        </div>
      </Reveal>
    </section>
  );
}
