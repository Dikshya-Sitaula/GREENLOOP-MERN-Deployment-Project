import { useRef } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Sprout } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Button from '../ui/Button';
import { EmptyState, ErrorState } from '../ui/States';
import ItemCard from '../items/ItemCard';
import { ItemCardSkeleton } from '../items/ItemGrid';

const SLIDE = 'w-[78%] shrink-0 snap-start min-[480px]:w-[46%] md:w-[31%] lg:w-[23.5%]';

export default function FreshListings({ items, loading, error, onRetry }) {
  const track = useRef(null);
  const scroll = (dir) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });

  return (
    <section className="section bg-paper">
      <div className="site-container">
        <SectionHeader
          eyebrow="Fresh listings"
          title="Just given another chance"
          action={
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => scroll(-1)} aria-label="Previous listings" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface transition hover:border-ink/30">
                <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
              </button>
              <button type="button" onClick={() => scroll(1)} aria-label="Next listings" className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface transition hover:border-ink/30">
                <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          }
        />

        <div className="mt-10">
          {error ? (
            <ErrorState message={error.message} onRetry={onRetry} />
          ) : !loading && !items?.length ? (
            <EmptyState icon={Sprout} title="No listings yet" message="Be the first to give something another life." action={<Button to="/sell">List an item</Button>} />
          ) : (
            <div ref={track} className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0" aria-busy={loading}>
              {loading
                ? Array.from({ length: 4 }, (_, i) => (
                    <div key={i} className={SLIDE}>
                      <ItemCardSkeleton />
                    </div>
                  ))
                : items.map((item) => (
                    <div key={item._id} className={SLIDE}>
                      <ItemCard item={item} />
                    </div>
                  ))}
            </div>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Button to="/explore" variant="outline">
            Browse all listings <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </section>
  );
}
