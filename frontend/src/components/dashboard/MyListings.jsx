import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Pencil, Plus, PackageOpen } from 'lucide-react';
import { fetchItems, updateItem, uploadImages } from '../../api/items';
import { useMeta } from '../../api/meta';
import { useAsync } from '../../lib/hooks';
import { priceLabel } from '../../lib/format';
import SmartImage from '../ui/SmartImage';
import TypePill from '../ui/TypePill';
import StatusBadge from '../ui/StatusBadge';
import ListingActions from '../items/ListingActions';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import Field from '../ui/Field';
import PhotoManager from '../sell/PhotoManager';
import { EmptyState, ErrorState, Skeleton } from '../ui/States';

function EditModal({ item, onClose, onSaved }) {
  const meta = useMeta();
  const [form, setForm] = useState({ title: item.title, description: item.description, condition: item.condition, price: item.price, wantInReturn: item.wantInReturn || '', wantedCategory: item.wantedCategory || '', wantedNote: item.wantedNote || '' });
  const [photos, setPhotos] = useState(() => (item.images || []).map((url) => ({ url, preview: url })));
  const [saving, setSaving] = useState(false);
  const photosRef = useRef(photos);
  photosRef.current = photos;
  useEffect(() => () => photosRef.current.forEach((p) => p.file && URL.revokeObjectURL(p.preview)), []);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    if (!photos.length) return toast.error('Keep at least one photo');
    setSaving(true);
    try {
      // Upload new files first, then send the final ordered list (first = cover).
      const fresh = photos.filter((p) => p.file);
      const uploaded = fresh.length ? (await uploadImages(fresh.map((p) => p.file))).urls : [];
      let next = 0;
      const images = photos.map((p) => (p.file ? uploaded[next++] : p.url));
      await updateItem(item._id, { ...form, price: Number(form.price) || 0, images });
      toast.success('Listing updated');
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
    return undefined;
  }

  return (
    <Modal open onClose={onClose} title="Edit listing" size="max-w-2xl">
      <form onSubmit={save} className="space-y-4">
        <div>
          <p className="label">Photos</p>
          <PhotoManager photos={photos} onChange={setPhotos} />
          <p className="mt-2 text-xs text-ink-muted">Up to 5 photos. The first one is the cover — use the star to change it.</p>
        </div>
        <Field label="Title" value={form.title} onChange={set('title')} maxLength={90} />
        <Field label="Condition" as="select" value={form.condition} onChange={set('condition')}>
          {(meta?.conditions || [form.condition]).map((c) => <option key={c}>{c}</option>)}
        </Field>
        {item.type === 'sell' && <Field label="Price (NPR)" type="number" min="1" value={form.price} onChange={set('price')} />}
        {item.type === 'repair' && <Field label="What needs fixing?" value={form.wantInReturn} onChange={set('wantInReturn')} maxLength={140} />}
        {item.type === 'swap' && (
          <>
            <Field label="Wanted category" as="select" value={form.wantedCategory} onChange={set('wantedCategory')}>
              <option value="">Open to anything</option>
              {(meta?.categories || []).map((c) => <option key={c.name}>{c.name}</option>)}
            </Field>
            <Field label="Note (optional)" value={form.wantedNote} onChange={set('wantedNote')} maxLength={140} />
          </>
        )}
        <Field label="Description" as="textarea" value={form.description} onChange={set('description')} maxLength={2000} />
        <Button type="submit" className="w-full" loading={saving}>Save changes</Button>
      </form>
    </Modal>
  );
}

export default function MyListings({ userId }) {
  // status=all returns every status (including paused), which the API only allows for your own listings.
  const { data, loading, error, reload } = useAsync(() => fetchItems({ owner: userId, status: 'all', limit: 48 }).then((d) => d.items), [userId]);
  const [editing, setEditing] = useState(null);

  if (loading) return <div className="space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>;
  if (error) return <ErrorState message={error.message} onRetry={reload} />;
  if (!data.length) {
    return <EmptyState icon={PackageOpen} title="No listings yet" message="Your old desk just found its next chapter — list your first item." action={<Button to="/sell" variant="accent"><Plus className="h-4 w-4" strokeWidth={1.5} /> List an item</Button>} />;
  }

  return (
    <>
      <ul className="space-y-3">
        {data.map((item) => (
          <li key={item._id} className={`flex flex-col gap-4 rounded-card border border-line bg-surface p-3 shadow-soft lg:flex-row lg:items-center ${item.status === 'paused' ? 'opacity-80' : ''}`}>
            <Link to={`/items/${item._id}`} className="flex min-w-0 flex-1 items-center gap-4">
              <SmartImage src={item.images?.[0]} alt={item.title} className="h-20 w-24 shrink-0 rounded-lg" />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={item.status} />
                  <TypePill type={item.type} />
                </div>
                <p className="mt-1.5 truncate font-semibold">{item.title}</p>
                <p className="num text-sm text-ink-muted">{priceLabel(item)} · Score {item.circularityScore}</p>
              </div>
            </Link>
            <div className="flex flex-wrap items-center gap-2 lg:max-w-[22rem] lg:justify-end">
              {item.status !== 'completed' && (
                <Button size="sm" variant="outline" onClick={() => setEditing(item)}><Pencil className="h-4 w-4" strokeWidth={1.5} /> Edit</Button>
              )}
              <ListingActions item={item} size="sm" onChanged={reload} onDeleted={reload} className="lg:justify-end" />
            </div>
          </li>
        ))}
      </ul>
      {editing && <EditModal item={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </>
  );
}
