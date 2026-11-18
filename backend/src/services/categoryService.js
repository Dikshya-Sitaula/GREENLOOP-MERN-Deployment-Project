import Category from '../models/Category.js';
import Item from '../models/Item.js';
import { categories as seedRows, LEGACY_CATEGORY_NAMES } from '../seed/categories.js';

// In-memory snapshot of the Category collection so scoring/impact helpers stay synchronous.
// Refreshed on boot and whenever categories are (re)seeded.
let cache = new Map();

export async function refreshCategories() {
  const docs = await Category.find().sort({ order: 1 }).lean();
  cache = new Map(docs.map((d) => [d.name, d]));
  return docs;
}

export const getCategory = (name) => cache.get(name);
export const isCategory = (name) => cache.has(name);

// Idempotent: upserts every seeded category by slug, then migrates items using retired names.
export async function seedCategories() {
  await Category.bulkWrite(
    seedRows.map((c) => ({ updateOne: { filter: { slug: c.slug }, update: { $set: c }, upsert: true } }))
  );
  await Category.deleteMany({ slug: { $nin: seedRows.map((c) => c.slug) } });
  await Promise.all(
    Object.entries(LEGACY_CATEGORY_NAMES).map(([from, to]) => Item.updateMany({ category: from }, { category: to }))
  );
  // Swap listings created before "wanted category" existed keep their old text as the note.
  await Item.updateMany(
    { type: 'swap', wantedNote: { $in: [null, ''] }, wantInReturn: { $nin: [null, ''] } },
    [{ $set: { wantedNote: '$wantInReturn', wantInReturn: '' } }]
  );
  return refreshCategories();
}
