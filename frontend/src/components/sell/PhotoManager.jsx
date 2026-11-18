import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ImagePlus, Star, X } from 'lucide-react';

export const MAX_FILES = 5;
const MAX_BYTES = 5 * 1024 * 1024;
const OK_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// photos: [{ preview, file? , url? }] — `file` is a new upload, `url` an image already stored on the listing.
// The first photo is the cover. Used by the create wizard and the edit dialog so validation matches.
export default function PhotoManager({ photos, onChange }) {
  const input = useRef(null);
  const [problem, setProblem] = useState('');

  function addFiles(fileList) {
    const incoming = Array.from(fileList);
    const valid = [];
    let msg = '';
    incoming.forEach((f) => {
      if (!OK_TYPES.includes(f.type)) msg = `${f.name} is not a JPG, PNG or WebP image`;
      else if (f.size > MAX_BYTES) msg = `${f.name} is larger than 5MB`;
      else valid.push({ file: f, preview: URL.createObjectURL(f) });
    });
    const room = MAX_FILES - photos.length;
    if (valid.length > room) {
      msg = `You can add up to ${MAX_FILES} photos`;
      valid.slice(room).forEach((p) => URL.revokeObjectURL(p.preview));
    }
    setProblem(msg);
    onChange([...photos, ...valid.slice(0, room)]);
    if (input.current) input.current.value = '';
  }

  function remove(i) {
    if (photos[i].file) URL.revokeObjectURL(photos[i].preview);
    setProblem('');
    onChange(photos.filter((_, idx) => idx !== i));
  }

  function move(from, to) {
    if (to < 0 || to >= photos.length) return;
    const next = [...photos];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }

  const tool = 'flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink shadow-soft hover:bg-white disabled:opacity-40 disabled:hover:bg-white/90';

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {photos.map((p, i) => (
          <div key={p.preview} className="group relative aspect-square overflow-hidden rounded-card border border-line">
            <img src={p.preview} alt={`Photo ${i + 1}`} className="h-full w-full object-cover" />
            {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-ink/80 px-2 py-0.5 text-[11px] font-medium text-white">Cover</span>}
            <button type="button" onClick={() => remove(i)} aria-label={`Remove photo ${i + 1}`} className={`absolute right-2 top-2 ${tool}`}>
              <X className="h-4 w-4" strokeWidth={1.75} />
            </button>
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between">
              <div className="flex gap-1">
                <button type="button" onClick={() => move(i, i - 1)} disabled={i === 0} aria-label={`Move photo ${i + 1} earlier`} className={tool}>
                  <ArrowLeft className="h-4 w-4" strokeWidth={1.75} />
                </button>
                <button type="button" onClick={() => move(i, i + 1)} disabled={i === photos.length - 1} aria-label={`Move photo ${i + 1} later`} className={tool}>
                  <ArrowRight className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>
              {i !== 0 && (
                <button type="button" onClick={() => move(i, 0)} aria-label={`Make photo ${i + 1} the cover`} className="flex h-7 items-center gap-1 rounded-full bg-white/90 px-2 text-[11px] font-medium text-ink shadow-soft hover:bg-white">
                  <Star className="h-3.5 w-3.5" strokeWidth={1.75} /> Cover
                </button>
              )}
            </div>
          </div>
        ))}
        {photos.length < MAX_FILES && (
          <button
            type="button"
            onClick={() => input.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}
            className="flex aspect-square flex-col items-center justify-center gap-2 rounded-card border-2 border-dashed border-line bg-surface text-sm text-ink-muted transition hover:border-forest-500 hover:text-forest-700"
          >
            <ImagePlus className="h-6 w-6" strokeWidth={1.5} />
            Add photos
          </button>
        )}
      </div>
      <input ref={input} type="file" accept="image/jpeg,image/png,image/webp" multiple hidden onChange={(e) => addFiles(e.target.files)} />
      {problem && <p role="alert" className="mt-3 text-sm font-medium text-error">{problem}</p>}
    </div>
  );
}
