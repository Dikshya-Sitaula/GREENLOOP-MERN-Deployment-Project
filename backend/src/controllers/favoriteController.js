import Favorite from '../models/Favorite.js';
import Item from '../models/Item.js';
import { ApiError, ok } from '../utils/http.js';
import { OWNER_FIELDS } from '../services/itemService.js';

export async function list(req, res) {
  const favs = await Favorite.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .populate({ path: 'item', populate: { path: 'owner', select: OWNER_FIELDS } })
    .lean();
  const items = favs
    .map((f) => f.item)
    .filter((i) => i && (i.status !== 'paused' || String(i.owner?._id) === String(req.user._id)))
    .map((i) => ({ ...i, saved: true }));
  ok(res, items);
}

// Toggles the save state and reports the new one.
export async function toggle(req, res) {
  const { itemId } = req.params;
  if (!(await Item.exists({ _id: itemId }))) throw new ApiError(404, 'Item not found');
  const removed = await Favorite.findOneAndDelete({ user: req.user._id, item: itemId });
  if (!removed) await Favorite.create({ user: req.user._id, item: itemId });
  ok(res, { saved: !removed }, removed ? 'Removed from saved' : 'Saved for later');
}
