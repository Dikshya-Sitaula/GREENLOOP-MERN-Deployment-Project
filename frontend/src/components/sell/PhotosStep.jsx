import PhotoManager from './PhotoManager';

// photos: [{ file, preview }]
export default function PhotosStep({ photos, onChange }) {
  return (
    <div>
      <h2 className="text-3xl tracking-tightest">Show it off</h2>
      <p className="mt-2 text-ink-muted">Clear, bright photos help it find a new home faster. Up to 5 images, 5MB each. The first photo is your cover.</p>
      <div className="mt-8">
        <PhotoManager photos={photos} onChange={onChange} />
      </div>
    </div>
  );
}
