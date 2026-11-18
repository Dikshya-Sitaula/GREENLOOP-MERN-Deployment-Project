import { StaggerGroup } from '../ui/Reveal';
import { EmptyState, ErrorState, Skeleton } from '../ui/States';
import ItemCard from './ItemCard';

export function ItemCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-card border border-line bg-surface">
      <Skeleton className="aspect-[4/3] rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-5 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

const GRID = 'grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';

// Renders all four list states: loading skeletons, error + retry, empty + action, and success.
export default function ItemGrid({ items, loading, error, onRetry, empty, onSavedChange, skeletons = 8, className = GRID }) {
  if (loading) {
    return (
      <div className={className} aria-busy="true" aria-label="Loading items">
        {Array.from({ length: skeletons }, (_, i) => (
          <ItemCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  if (error) return <ErrorState message={error.message} onRetry={onRetry} />;
  if (!items?.length) return <EmptyState {...empty} />;
  return (
    <StaggerGroup className={className}>
      {items.map((item) => (
        <ItemCard key={item._id} item={item} onSavedChange={onSavedChange} />
      ))}
    </StaggerGroup>
  );
}
