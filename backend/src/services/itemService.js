import Item from '../models/Item.js';
import Favorite from '../models/Favorite.js';
import { STATUSES } from './catalog.js';

const SORTS = {
  newest: { createdAt: -1 },
  price_asc: { price: 1, createdAt: -1 },
  price_desc: { price: -1, createdAt: -1 },
  score: { circularityScore: -1, createdAt: -1 },
};

export const OWNER_FIELDS = 'name city avatar bio createdAt';

// Translates query-string filters into a Mongo filter. Unknown values are ignored, never trusted.
export function buildFilter(q = {}, userId = null) {
  // Paused listings are only ever returned to their owner, who can also ask for every status at once.
  const ownerView = Boolean(userId && q.owner && String(q.owner) === String(userId));
  let status = { $in: ['active', 'reserved'] };
  if (q.status === 'completed') status = 'completed';
  else if (ownerView && q.status === 'paused') status = 'paused';
  else if (ownerView && q.status === 'all') status = { $in: STATUSES };
  const filter = { status };
  if (q.q) filter.$text = { $search: String(q.q).slice(0, 80) };
  if (q.category) filter.category = { $in: [].concat(q.category) };
  if (q.type) filter.type = { $in: [].concat(q.type) };
  if (q.condition) filter.condition = { $in: [].concat(q.condition) };
  if (q.city) filter.city = q.city;
  if (q.owner) filter.owner = String(q.owner);

  const min = Number(q.minPrice);
  const max = Number(q.maxPrice);
  if (Number.isFinite(min) && q.minPrice !== '') filter.price = { ...filter.price, $gte: min };
  if (Number.isFinite(max) && q.maxPrice !== '') filter.price = { ...filter.price, $lte: max };
  return filter;
}

export async function listItems(query, userId) {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(48, Math.max(1, parseInt(query.limit, 10) || 12));
  const filter = buildFilter(query, userId);
  const sort = SORTS[query.sort] || SORTS.newest;

  const [items, total] = await Promise.all([
    Item.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('owner', OWNER_FIELDS)
      .lean(),
    Item.countDocuments(filter),
  ]);

  await markSaved(items, userId);
  return { items, total, page, pages: Math.max(1, Math.ceil(total / limit)) };
}

// Adds `saved: boolean` to each item for the signed-in user.
export async function markSaved(items, userId) {
  if (!userId || !items.length) {
    items.forEach((i) => {
      i.saved = false;
    });
    return items;
  }
  const favs = await Favorite.find({ user: userId, item: { $in: items.map((i) => i._id) } }).select('item').lean();
  const saved = new Set(favs.map((f) => String(f.item)));
  items.forEach((i) => {
    i.saved = saved.has(String(i._id));
  });
  return items;
}
