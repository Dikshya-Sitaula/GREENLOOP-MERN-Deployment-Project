import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import SmartImage from '../ui/SmartImage';
import { Skeleton } from '../ui/States';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';

// First tile is featured (2x2); the last spans two columns so the grid closes cleanly at 8 categories.
const spanFor = (i, n) => (i === 0 ? 'md:col-span-2 md:row-span-2' : i === n - 1 && n % 2 === 0 ? 'md:col-span-2' : '');

const FEATURED = 8;

export default function CategoryBento({ categories: all }) {
  // The bento shows the eight busiest categories; the rest are one click away in Explore.
  const categories = all && [...all].sort((a, b) => b.count - a.count).slice(0, FEATURED);
  return (
    <section className="section bg-surface">
      <div className="site-container">
        <SectionHeader eyebrow="Browse by category" title="Find what you need, near you" sub="From textbooks to treadmills — everything here already exists. Give it a second home." />
        <StaggerGroup className="mt-12 grid auto-rows-[190px] grid-cols-2 gap-4 md:auto-rows-[200px] md:grid-cols-4">
          {!categories
            ? Array.from({ length: 8 }, (_, i) => <Skeleton key={i} className={spanFor(i, 8)} />)
            : categories.map((c, i) => (
                <StaggerItem key={c.slug} className={spanFor(i, categories.length)}>
                  <Link
                    to={`/explore?category=${encodeURIComponent(c.name)}`}
                    className="group relative block h-full overflow-hidden rounded-card"
                  >
                    <SmartImage src={c.cover} alt={`${c.name} listings`} className="h-full w-full" imgClassName="transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white md:p-5">
                      <div>
                        <p className={`font-display tracking-tight ${i === 0 ? 'text-3xl md:text-4xl' : 'text-xl'}`}>{c.name}</p>
                        <p className="num text-xs text-white/75">{c.count} available</p>
                      </div>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink transition group-hover:bg-white">
                        <ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    </div>
                  </Link>
                </StaggerItem>
              ))}
        </StaggerGroup>
        {all && all.length > FEATURED && (
          <p className="mt-8 text-center text-sm text-ink-muted">
            Plus {all.length - FEATURED} more — <Link to="/explore" className="font-medium text-forest-700 underline">browse all categories</Link>
          </p>
        )}
      </div>
    </section>
  );
}
