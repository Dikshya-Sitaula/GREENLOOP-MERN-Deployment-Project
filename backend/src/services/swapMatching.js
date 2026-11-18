import Item from '../models/Item.js';
import { OWNER_FIELDS } from './itemService.js';

// Swap matching is driven by the listing's wantedCategory:
//  - for someone viewing another member's swap listing, their own active items in that category rank first;
//  - for the owner of a swap listing, other members' active swap listings in the wanted category are suggested.
export async function swapMatches(target, userId) {
  const wanted = target.wantedCategory || '';
  if (target.owner.equals(userId)) {
    if (!wanted) return { wantedCategory: '', mode: 'candidates', items: [] };
    const items = await Item.find({
      status: 'active',
      type: 'swap',
      category: wanted,
      owner: { $ne: userId },
    })
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('owner', OWNER_FIELDS)
      .lean();
    return { wantedCategory: wanted, mode: 'candidates', items };
  }

  const mine = await Item.find({ owner: userId, status: 'active' }).sort({ createdAt: -1 }).limit(48).lean();
  const items = mine
    .map((it) => ({ ...it, matchesWanted: Boolean(wanted) && it.category === wanted }))
    .sort((a, b) => Number(b.matchesWanted) - Number(a.matchesWanted));
  return { wantedCategory: wanted, mode: 'offers', items };
}
