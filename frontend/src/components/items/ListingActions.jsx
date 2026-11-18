import { useState } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2, Clock, Pause, Play, RotateCcw, Trash2, Undo2 } from 'lucide-react';
import { deleteItem, setItemStatus } from '../../api/items';
import Button from '../ui/Button';
import ConfirmDialog from '../ui/ConfirmDialog';

// Owner controls for a listing: complete (with confirmation and Undo), reserve, pause/resume,
// reopen and delete (with confirmation). The API validates every transition.
export default function ListingActions({ item, onChanged, onDeleted, size = 'md', className = '' }) {
  const [busy, setBusy] = useState('');
  const [confirm, setConfirm] = useState(null); // 'complete' | 'delete'
  const { status } = item;

  async function change(next, label, success) {
    setBusy(label);
    try {
      const res = await setItemStatus(item._id, next);
      success?.(res);
      onChanged?.(res);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusy('');
      setConfirm(null);
    }
  }

  function showUndo(message) {
    toast.custom(
      (t) => (
        <div role="status" className={`flex items-center gap-4 rounded-xl bg-ink px-4 py-3 text-sm text-white shadow-lift transition-opacity ${t.visible ? 'opacity-100' : 'opacity-0'}`}>
          <span>{message}</span>
          <button
            type="button"
            className="inline-flex items-center gap-1 font-semibold text-marigold hover:underline"
            onClick={async () => {
              toast.dismiss(t.id);
              try {
                const res = await setItemStatus(item._id, 'active');
                toast.success('Listing reopened — impact adjusted');
                onChanged?.(res);
              } catch (err) {
                toast.error(err.message);
              }
            }}
          >
            <Undo2 className="h-4 w-4" strokeWidth={1.75} /> Undo
          </button>
        </div>
      ),
      { duration: 8000 }
    );
  }

  async function remove() {
    setBusy('delete');
    try {
      await deleteItem(item._id);
      toast.success('Listing deleted');
      setConfirm(null);
      onDeleted?.();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy('');
    }
  }

  const icon = 'h-4 w-4';
  const locked = Boolean(busy);

  return (
    <>
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {(status === 'active' || status === 'reserved') && (
          <Button size={size} variant="accent" disabled={locked} onClick={() => setConfirm('complete')}>
            <CheckCircle2 className={icon} strokeWidth={1.5} /> Mark as completed
          </Button>
        )}
        {status === 'active' && (
          <Button size={size} variant="outline" loading={busy === 'reserve'} disabled={locked} onClick={() => change('reserved', 'reserve', () => toast.success('Marked as reserved'))}>
            <Clock className={icon} strokeWidth={1.5} /> Reserve
          </Button>
        )}
        {status === 'reserved' && (
          <Button size={size} variant="outline" loading={busy === 'available'} disabled={locked} onClick={() => change('active', 'available', () => toast.success('Back to available'))}>
            <RotateCcw className={icon} strokeWidth={1.5} /> Mark available
          </Button>
        )}
        {(status === 'active' || status === 'reserved') && (
          <Button size={size} variant="outline" loading={busy === 'pause'} disabled={locked} onClick={() => change('paused', 'pause', () => toast.success('Listing paused — only you can see it'))}>
            <Pause className={icon} strokeWidth={1.5} /> Pause
          </Button>
        )}
        {status === 'paused' && (
          <Button size={size} variant="accent" loading={busy === 'resume'} disabled={locked} onClick={() => change('active', 'resume', () => toast.success('Listing is live again'))}>
            <Play className={icon} strokeWidth={1.5} /> Resume
          </Button>
        )}
        {status === 'completed' && (
          <Button size={size} variant="outline" loading={busy === 'reopen'} disabled={locked} onClick={() => change('active', 'reopen', () => toast.success('Listing reopened — impact adjusted'))}>
            <RotateCcw className={icon} strokeWidth={1.5} /> Reopen listing
          </Button>
        )}
        {status !== 'completed' && (
          <Button size={size} variant="ghost" disabled={locked} aria-label={`Delete ${item.title}`} onClick={() => setConfirm('delete')}>
            <Trash2 className={`${icon} text-error`} strokeWidth={1.5} /> <span className="text-error">Delete</span>
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirm === 'complete'}
        title="Mark as completed?"
        message={<>“{item.title}” will be counted towards your impact (about {item.estimatedKg} kg) and stop showing as available. You can undo this straight afterwards, or reopen it later.</>}
        confirmLabel="Mark as completed"
        loading={busy === 'complete'}
        onClose={() => setConfirm(null)}
        onConfirm={() => change('completed', 'complete', () => showUndo('Marked as completed'))}
      />
      <ConfirmDialog
        open={confirm === 'delete'}
        title="Delete this listing?"
        message={<>“{item.title}” and its photos will be permanently removed. This can&apos;t be undone.</>}
        confirmLabel="Delete listing"
        danger
        loading={busy === 'delete'}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
      />
    </>
  );
}
