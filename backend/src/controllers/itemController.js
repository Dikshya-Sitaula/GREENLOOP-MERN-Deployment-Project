import Item from '../models/Item.js';
import Favorite from '../models/Favorite.js';
import { ApiError, ok } from '../utils/http.js';
import { listItems, markSaved, OWNER_FIELDS } from '../services/itemService.js';
import { calculateCircularity, withCircularity } from '../services/circularityService.js';
import { estimateKg } from '../services/impactService.js';
import { changeStatus } from '../services/listingStatus.js';
import SwapRequest from '../models/SwapRequest.js';
import { publicPath } from '../middleware/upload.js';
import { deleteUploads, isLocalUpload, uploadExists } from '../services/uploadService.js';

const EDITABLE = ['title', 'description', 'category', 'condition', 'type', 'price', 'wantInReturn', 'wantedCategory', 'wantedNote', 'city', 'images'];

// Loads an item and enforces that the caller owns it (or is an admin).
async function ownedItem(req) {
  const item = await Item.findById(req.params.id);
  if (!item) throw new ApiError(404, 'Item not found');
  const isOwner = item.owner.equals(req.user._id);
  if (!isOwner && req.user.role !== 'admin') throw new ApiError(403, 'You can only change your own listings');
  return item;
}

function normalise(item) {
  if (item.type !== 'sell') item.price = 0;
  if (item.type !== 'repair') item.wantInReturn = '';
  if (item.type !== 'swap') {
    item.wantedCategory = '';
    item.wantedNote = '';
  }
  withCircularity(item);
  item.estimatedKg = estimateKg(item.category);
  return item;
}

export async function list(req, res) {
  ok(res, await listItems(req.query, req.user?._id));
}

export async function getOne(req, res) {
  // Seller email is only revealed to signed-in members.
  const item = await Item.findById(req.params.id)
    .populate('owner', req.user ? `${OWNER_FIELDS} email` : OWNER_FIELDS)
    .lean();
  if (!item) throw new ApiError(404, 'Item not found');
  // Paused listings are private to their owner (and admins); everyone else sees a 404.
  const viewerOwns = req.user && (String(item.owner._id) === String(req.user._id) || req.user.role === 'admin');
  if (item.status === 'paused' && !viewerOwns) throw new ApiError(404, 'Item not found');
  await markSaved([item], req.user?._id);
  const similar = await Item.find({ category: item.category, _id: { $ne: item._id }, status: 'active' })
    .sort({ createdAt: -1 })
    .limit(4)
    .populate('owner', OWNER_FIELDS)
    .lean();
  await markSaved(similar, req.user?._id);
  ok(res, { item, similar });
}

export async function create(req, res) {
  const data = Object.fromEntries(EDITABLE.filter((k) => req.body[k] !== undefined).map((k) => [k, req.body[k]]));
  const item = normalise(new Item({ ...data, owner: req.user._id }));
  await item.save();
  ok(res, item, 'Your item is live', 201);
}

export async function update(req, res) {
  const item = await ownedItem(req);
  if (item.status === 'completed') throw new ApiError(400, 'Completed listings can no longer be edited');

  // Photos: owner only (not admins), 1–5 unique images, uploaded files must exist. The first image is the cover.
  const previousImages = [...item.images];
  if (req.body.images !== undefined) {
    if (!item.owner.equals(req.user._id)) throw new ApiError(403, 'Only the owner can change photos');
    const images = [...new Set(req.body.images)];
    if (!images.length) throw new ApiError(400, 'Keep at least one photo');
    for (const url of images) {
      if (!previousImages.includes(url) && isLocalUpload(url) && !(await uploadExists(url))) {
        throw new ApiError(400, 'One of the uploaded photos could not be found');
      }
    }
    req.body.images = images;
  }
  EDITABLE.forEach((k) => {
    if (req.body[k] !== undefined) item[k] = req.body[k];
  });
  normalise(item);
  await item.save();
  await deleteUploads(previousImages.filter((url) => !item.images.includes(url)));
  ok(res, item, 'Listing updated');
}

export async function remove(req, res) {
  const item = await ownedItem(req);
  if (item.status === 'completed') throw new ApiError(400, 'Reopen this listing before deleting it so your impact stays accurate');
  await Promise.all([
    item.deleteOne(),
    Favorite.deleteMany({ item: item._id }),
    // Swap proposals that involve a deleted listing can no longer be fulfilled.
    SwapRequest.updateMany({ status: 'pending', $or: [{ offeredItem: item._id }, { requestedItem: item._id }] }, { status: 'rejected' }),
  ]);
  await deleteUploads(item.images);
  ok(res, null, 'Listing deleted');
}

// Single entry point for status changes; changeStatus enforces the allowed transitions.
export async function setStatus(req, res) {
  const item = await ownedItem(req);
  const { status } = req.body;
  const from = item.status;
  await changeStatus(item, status);
  const messages = {
    completed: 'Nice — your impact has been updated',
    active: from === 'completed' ? 'Listing reopened and impact adjusted' : 'Your listing is active again',
    reserved: 'Marked as reserved',
    paused: 'Listing paused — only you can see it',
  };
  ok(res, item, messages[status]);
}

// Live preview used by the create-listing wizard. Pure calculation, no DB writes.
export function scorePreview(req, res) {
  const { condition, category, type } = req.body;
  ok(res, { ...calculateCircularity({ condition, category, type }), estimatedKg: estimateKg(category) });
}

export function uploadFiles(req, res) {
  if (!req.files?.length) throw new ApiError(400, 'Choose at least one image');
  ok(res, { urls: req.files.map(publicPath) }, 'Images uploaded', 201);
}
