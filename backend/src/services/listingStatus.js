import ImpactRecord from '../models/ImpactRecord.js';
import { ApiError } from '../utils/http.js';
import { STATUSES } from './catalog.js';
import { recordCompletion } from './impactService.js';

// Allowed moves. Paused listings must be resumed first; completed ones can only be reopened.
export const TRANSITIONS = {
  active: ['reserved', 'paused', 'completed'],
  reserved: ['active', 'paused', 'completed'],
  paused: ['active'],
  completed: ['active'],
};

// Applies a validated status change and keeps ImpactRecords in step:
// completing records impact; reopening removes the related record so totals stay accurate.
export async function changeStatus(item, next) {
  if (!STATUSES.includes(next)) throw new ApiError(400, 'Unknown status');
  if (item.status === next) throw new ApiError(400, `This listing is already ${next}`);
  if (!TRANSITIONS[item.status].includes(next)) {
    throw new ApiError(400, `A ${item.status} listing cannot be changed to ${next}`);
  }

  const wasCompleted = item.status === 'completed';
  item.status = next;
  item.completedAt = next === 'completed' ? new Date() : undefined;
  await item.save();

  if (next === 'completed') await recordCompletion(item, item.owner);
  if (wasCompleted) await ImpactRecord.deleteMany({ item: item._id });
  return item;
}
