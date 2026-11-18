import Item from '../models/Item.js';

// Older data stored demo photos as Unsplash links or as /seed-images/<id>.jpg. Both now live in
// frontend/public/images (served at /images/<id>.jpg).
const LEGACY = [
  /^https:\/\/images\.unsplash\.com\/photo-([\w-]+)\?.*$/,
  /^\/seed-images\/([\w-]+)\.jpg$/,
];

const toLocal = (url) => {
  for (const re of LEGACY) {
    const m = re.exec(url);
    if (m) return `/images/${m[1]}.jpg`;
  }
  return url;
};

// Idempotent: rewrites only legacy URLs, leaves /uploads/... and /images/... untouched.
export async function localizeDemoImages() {
  const items = await Item.find({ images: { $in: LEGACY } }).select('images');
  for (const item of items) {
    await Item.updateOne({ _id: item._id }, { $set: { images: item.images.map(toLocal) } });
  }
  if (items.length) console.log(`✓ Localized photos on ${items.length} listings`);
}
