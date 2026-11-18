import { useState } from 'react';
import toast from 'react-hot-toast';
import { ArrowRight, Check, Repeat2, X } from 'lucide-react';
import { fetchSwaps, respondToSwap } from '../../api/community';
import { useAsync } from '../../lib/hooks';
import { timeAgo } from '../../lib/format';
import SmartImage from '../ui/SmartImage';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import { EmptyState, ErrorState, Skeleton } from '../ui/States';

const STATUS = {
  pending: 'bg-marigold-100 text-[#8A5A12]',
  accepted: 'bg-forest-100 text-forest-700',
  rejected: 'bg-error/10 text-error',
  completed: 'bg-forest-100 text-forest-700',
};

function Mini({ item }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <SmartImage src={item?.images?.[0]} alt="" className="h-12 w-12 shrink-0 rounded-md" />
      <span className="line-clamp-2 text-sm font-medium">{item?.title || 'Removed item'}</span>
    </div>
  );
}

function SwapRow({ swap, incoming, onRespond, busy }) {
  const other = incoming ? swap.fromUser : swap.toUser;
  return (
    <li className="rounded-card border border-line bg-surface p-4 shadow-soft">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Avatar user={other} size="h-8 w-8 text-xs" />
          <p className="text-sm"><span className="font-semibold">{other?.name}</span> <span className="text-ink-muted">· {timeAgo(swap.createdAt)}</span></p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS[swap.status]}`}>{swap.status}</span>
      </div>
      <div className="mt-4 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <Mini item={swap.offeredItem} />
        <ArrowRight className="hidden h-4 w-4 text-ink-muted sm:block" strokeWidth={1.5} aria-label="for" />
        <Mini item={swap.requestedItem} />
      </div>
      {swap.message && <p className="mt-3 rounded-lg bg-paper p-3 text-sm text-ink-muted">“{swap.message}”</p>}
      {incoming && swap.status === 'pending' && (
        <div className="mt-4 flex gap-2">
          <Button size="sm" loading={busy === swap._id} onClick={() => onRespond(swap._id, 'accepted')}><Check className="h-4 w-4" strokeWidth={1.75} /> Accept</Button>
          <Button size="sm" variant="outline" disabled={busy === swap._id} onClick={() => onRespond(swap._id, 'rejected')}><X className="h-4 w-4" strokeWidth={1.75} /> Decline</Button>
        </div>
      )}
    </li>
  );
}

function Column({ title, rows, incoming, onRespond, busy }) {
  return (
    <div>
      <h3 className="mb-3 font-sans text-sm font-semibold uppercase tracking-wider text-ink-muted">{title} <span className="num">({rows.length})</span></h3>
      {rows.length ? (
        <ul className="space-y-3">{rows.map((s) => <SwapRow key={s._id} swap={s} incoming={incoming} onRespond={onRespond} busy={busy} />)}</ul>
      ) : (
        <EmptyState icon={Repeat2} title={incoming ? 'No requests yet' : 'No proposals yet'} message={incoming ? 'When someone offers a swap for your item it shows up here.' : 'Find a swap listing and propose a trade.'} />
      )}
    </div>
  );
}

export default function SwapRequests() {
  const { data, loading, error, reload } = useAsync(fetchSwaps, []);
  const [busy, setBusy] = useState('');

  async function respond(id, status) {
    setBusy(id);
    try {
      await respondToSwap(id, status);
      toast.success(status === 'accepted' ? 'Swap accepted — impact updated' : 'Request declined');
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  }

  if (loading) return <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-48" /><Skeleton className="h-48" /></div>;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Column title="Incoming" rows={data.incoming} incoming onRespond={respond} busy={busy} />
      <Column title="Outgoing" rows={data.outgoing} onRespond={respond} busy={busy} />
    </div>
  );
}
