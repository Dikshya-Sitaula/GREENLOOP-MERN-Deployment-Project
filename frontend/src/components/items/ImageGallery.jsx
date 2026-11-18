import { useState } from 'react';
import SmartImage from '../ui/SmartImage';

export default function ImageGallery({ images = [], title }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [null];
  return (
    <div>
      <SmartImage src={list[active]} alt={title} className="aspect-[4/3] rounded-card border border-line" eager />
      {list.length > 1 && (
        <div className="mt-3 flex gap-3 overflow-x-auto" role="tablist" aria-label="Photos">
          {list.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Photo ${i + 1} of ${list.length}`}
              onClick={() => setActive(i)}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition ${i === active ? 'border-forest-700' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <SmartImage src={src} alt="" className="h-full w-full" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
