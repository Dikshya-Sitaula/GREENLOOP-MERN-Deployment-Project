import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Repeat2 } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import SmartImage from '../ui/SmartImage';
import Field from '../ui/Field';
import { EmptyState, ErrorState, Skeleton } from '../ui/States';
import { fetchSwapMatches, proposeSwap } from '../../api/community';
import { useAuth } from '../../context/AuthContext';

export default function SwapModal({ open, onClose, target }) {
  const { user } = useAuth();
  const [mine, setMine] = useState({ items: null, error: null });
  const [chosen, setChosen] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const load = () => {
    setMine({ items: null, error: null });
    // The API ranks items in the listing's wanted category first.
    fetchSwapMatches(target._id)
      .then((d) => setMine({ items: d.items, error: null, wanted: d.wantedCategory }))
      .catch((error) => setMine({ items: null, error }));
  };
  useEffect(() => {
    if (open && user) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function send() {
    setSending(true);
    try {
      await proposeSwap({ offeredItem: chosen, requestedItem: target._id, message });
      toast.success('Swap proposed');
      onClose();
      setChosen('');
      setMessage('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title={`Swap for “${target?.title}”`}>
      <p className="text-sm text-ink-muted">
        Choose one of your active items to offer.
        {mine.wanted && <> They are looking for <strong className="text-ink">{mine.wanted}</strong>{target?.wantedNote ? ` — ${target.wantedNote}` : ''}.</>}
      </p>
      <div className="mt-4">
        {mine.error ? (
          <ErrorState message={mine.error.message} onRetry={load} />
        ) : !mine.items ? (
          <Skeleton className="h-40" />
        ) : !mine.items.length ? (
          <EmptyState icon={Repeat2} title="Nothing to offer yet" message="List an item first, then propose your swap." action={<Button to="/sell">List an item</Button>} />
        ) : (
          <ul className="max-h-64 space-y-2 overflow-y-auto" role="radiogroup" aria-label="Your items">
            {mine.items.map((it) => (
              <li key={it._id}>
                <label className={`flex cursor-pointer items-center gap-3 rounded-lg border p-2.5 transition ${chosen === it._id ? 'border-forest-700 bg-forest-100/50' : 'border-line hover:border-ink/30'}`}>
                  <input type="radio" name="offer" className="accent-forest-700" checked={chosen === it._id} onChange={() => setChosen(it._id)} />
                  <SmartImage src={it.images?.[0]} alt="" className="h-12 w-12 shrink-0 rounded-md" />
                  <span className="line-clamp-1 flex-1 text-sm font-medium">{it.title}</span>
                  {it.matchesWanted && <span className="shrink-0 rounded-full bg-forest-100 px-2 py-0.5 text-xs font-medium text-forest-900">Good match</span>}
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>
      {mine.items?.length > 0 && (
        <>
          <Field className="mt-4" label="Message (optional)" as="textarea" maxLength={500} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Say hello and suggest a pickup spot" />
          <Button className="mt-5 w-full" size="lg" disabled={!chosen} loading={sending} onClick={send}>Send swap proposal</Button>
        </>
      )}
    </Modal>
  );
}
