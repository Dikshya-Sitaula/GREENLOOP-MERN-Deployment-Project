import SwapRequest from '../models/SwapRequest.js';
import Item from '../models/Item.js';
import { ApiError, ok } from '../utils/http.js';
import { recordCompletion } from '../services/impactService.js';
import { swapMatches } from '../services/swapMatching.js';

const populateSwap = (q) =>
  q
    .populate('fromUser', 'name city avatar')
    .populate('toUser', 'name city avatar')
    .populate('offeredItem', 'title images type price status')
    .populate('requestedItem', 'title images type price status');

export async function mine(req, res) {
  const [incoming, outgoing] = await Promise.all([
    populateSwap(SwapRequest.find({ toUser: req.user._id }).sort({ createdAt: -1 })).lean(),
    populateSwap(SwapRequest.find({ fromUser: req.user._id }).sort({ createdAt: -1 })).lean(),
  ]);
  ok(res, { incoming, outgoing });
}

export async function matches(req, res) {
  const target = await Item.findById(req.params.itemId);
  if (!target) throw new ApiError(404, 'Item not found');
  ok(res, await swapMatches(target, req.user._id));
}

export async function create(req, res) {
  const { offeredItem, requestedItem, message } = req.body;
  const [offered, requested] = await Promise.all([Item.findById(offeredItem), Item.findById(requestedItem)]);

  if (!offered || !requested) throw new ApiError(404, 'Item not found');
  if (!offered.owner.equals(req.user._id)) throw new ApiError(403, 'You can only offer your own items');
  if (requested.owner.equals(req.user._id)) throw new ApiError(400, 'You cannot swap with yourself');
  if (offered.status !== 'active' || requested.status !== 'active') throw new ApiError(400, 'One of these items is no longer available');

  const duplicate = await SwapRequest.exists({
    fromUser: req.user._id,
    offeredItem,
    requestedItem,
    status: 'pending',
  });
  if (duplicate) throw new ApiError(409, 'You already proposed this swap');

  const swap = await SwapRequest.create({
    fromUser: req.user._id,
    toUser: requested.owner,
    offeredItem,
    requestedItem,
    message,
  });
  ok(res, swap, 'Swap proposed. We will let them know.', 201);
}

// Only the receiving owner may respond. Accepting completes both items and records impact for both people.
export async function respond(req, res) {
  const swap = await SwapRequest.findById(req.params.id);
  if (!swap) throw new ApiError(404, 'Swap request not found');
  if (!swap.toUser.equals(req.user._id)) throw new ApiError(403, 'Only the item owner can respond to this request');
  if (swap.status !== 'pending') throw new ApiError(400, `This request was already ${swap.status}`);

  const { status } = req.body;
  if (status === 'accepted') {
    const items = await Item.find({ _id: { $in: [swap.offeredItem, swap.requestedItem] } });
    if (items.some((i) => i.status !== 'active')) throw new ApiError(400, 'One of these items is no longer available');
    await Promise.all(
      items.map(async (item) => {
        item.status = 'completed';
        item.completedAt = new Date();
        await item.save();
        await recordCompletion(item, item.owner);
      })
    );
    // Any other pending requests involving these items can no longer be fulfilled.
    await SwapRequest.updateMany(
      {
        _id: { $ne: swap._id },
        status: 'pending',
        $or: [
          { offeredItem: { $in: items.map((i) => i._id) } },
          { requestedItem: { $in: items.map((i) => i._id) } },
        ],
      },
      { status: 'rejected' }
    );
  }
  swap.status = status;
  await swap.save();
  ok(res, swap, status === 'accepted' ? 'Swap accepted — impact updated for both of you' : 'Request declined');
}
