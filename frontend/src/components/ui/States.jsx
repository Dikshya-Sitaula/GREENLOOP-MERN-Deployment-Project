import { AlertTriangle, RotateCw, Sprout } from 'lucide-react';
import Button from './Button';

export function Skeleton({ className = '' }) {
  return <div className={`animate-pulse rounded-card bg-line/60 ${className}`} aria-hidden />;
}

export function ErrorState({ message = 'Something went wrong.', onRetry, className = '' }) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center rounded-card border border-line bg-surface px-6 py-12 text-center ${className}`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-error/10 text-error">
        <AlertTriangle className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 text-xl">We couldn&apos;t load this</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" className="mt-5" onClick={onRetry}>
          <RotateCw className="h-4 w-4" strokeWidth={1.5} /> Try again
        </Button>
      )}
    </div>
  );
}

export function EmptyState({ icon: Icon = Sprout, title, message, action, className = '' }) {
  return (
    <div
      className={`flex flex-col items-center rounded-card border border-dashed border-line bg-surface/60 px-6 py-14 text-center ${className}`}
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-forest-100 text-forest-700">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </span>
      <h3 className="mt-4 text-xl">{title}</h3>
      {message && <p className="mt-1.5 max-w-sm text-sm text-ink-muted">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
