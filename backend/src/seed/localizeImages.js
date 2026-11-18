import Item from '../models/Item.js';

const REMOTE = /^https:\/\/images\.unsplash\.com\/photo-([\w-]+)\?.*$/;

// One-off, idempotent migration: demo listings stored in MongoDB before photos were self-hosted
// still point at Unsplash. Rewrite them to the local copies in /images (frontend/public/images).
export async function localizeDemoImages() {
  const items = await Item.find({ images: REMOTE }).select('images');
  for (const item of items) {
    const images = item.images.map((u) => {
      const m = REMOTE.exec(u);
      return m ? `/images/${m[1]}.jpg` : u;
    });
    await Item.updateOne({ _id: item._id }, { $set: { images } });
  }
  if (items.length) console.log(`✓ Localized photos on ${items.length} listings`);
}
