import { Quote } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Avatar from '../ui/Avatar';
import { ErrorState, Skeleton } from '../ui/States';
import { StaggerGroup, StaggerItem } from '../ui/Reveal';

export default function Testimonials({ items, loading, error, onRetry }) {
  if (!loading && !error && !items?.length) return null;
  return (
    <section className="section bg-paper">
      <div className="site-container">
        <SectionHeader center eyebrow="Stories from the loop" title="Neighbours giving things another chapter" />
        {error ? (
          <ErrorState className="mt-12" message={error.message} onRetry={onRetry} />
        ) : (
          <StaggerGroup className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-64" />)
              : items.map((t) => (
                  <StaggerItem key={t._id} className="flex flex-col rounded-card border border-line bg-surface p-6 shadow-soft">
                    <Quote className="h-6 w-6 text-marigold" strokeWidth={1.5} aria-hidden />
                    <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">{t.quote}</blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-4">
                      <Avatar user={t.user} />
                      <div>
                        <p className="text-sm font-semibold">{t.user?.name}</p>
                        <p className="text-xs text-ink-muted">{t.user?.city} · {t.highlight}</p>
                      </div>
                    </figcaption>
                  </StaggerItem>
                ))}
          </StaggerGroup>
        )}
        <p className="mt-8 text-center text-xs text-ink-muted">Demo members and stories.</p>
      </div>
    </section>
  );
}
