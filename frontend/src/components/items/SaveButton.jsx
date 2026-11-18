import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { toggleFavorite } from '../../api/items';
import { useAuth } from '../../context/AuthContext';

// Heart button with optimistic update. Sends logged-out users to log in first.
export default function SaveButton({ item, onChange, className = '', label = false }) {
  const { isAuthed } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [saved, setSaved] = useState(!!item.saved);
  const [busy, setBusy] = useState(false);

  useEffect(() => setSaved(!!item.saved), [item.saved]);

  async function onClick(e) {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthed) {
      toast('Log in to save items');
      navigate('/login', { state: { from: location.pathname + location.search } });
      return;
    }
    if (busy) return;
    setBusy(true);
    setSaved((s) => !s);
    try {
      const res = await toggleFavorite(item._id);
      setSaved(res.saved);
      onChange?.(item._id, res.saved);
    } catch (err) {
      setSaved((s) => !s);
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? `Remove ${item.title} from saved` : `Save ${item.title}`}
      className={`inline-flex items-center gap-2 rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white ${
        label ? 'h-11 px-5 text-sm font-medium' : 'h-9 w-9 justify-center'
      } ${className}`}
    >
      <Heart
        className={`h-[18px] w-[18px] transition ${saved ? 'fill-error text-error' : ''}`}
        strokeWidth={1.5}
        aria-hidden
      />
      {label && (saved ? 'Saved' : 'Save')}
    </button>
  );
}
