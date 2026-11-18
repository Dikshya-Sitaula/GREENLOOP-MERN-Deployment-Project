import { useState } from 'react';
import { ImageOff } from 'lucide-react';

// Lazy-loaded image that fades in on load and falls back to a calm placeholder on error.
export default function SmartImage({ src, alt, className = '', imgClassName = '', eager = false }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(!src);

  return (
    <div className={`relative overflow-hidden bg-forest-100/60 ${className}`}>
      {failed ? (
        <div className="absolute inset-0 flex items-center justify-center text-forest-500/60">
          <ImageOff className="h-6 w-6" strokeWidth={1.5} aria-hidden />
          <span className="sr-only">{alt}</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`h-full w-full object-cover transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName}`}
        />
      )}
    </div>
  );
}
