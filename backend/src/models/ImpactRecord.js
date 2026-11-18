import mongoose from 'mongoose';
import { ACTIONS } from '../services/catalog.js';

const impactRecordSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    action: { type: String, enum: ACTIONS, required: true },
    category: { type: String, default: '' },
    kg: { type: Number, required: true, min: 0 },
    valueNpr: { type: Number, default: 0, min: 0 },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

impactRecordSchema.index({ user: 1, date: -1 });
impactRecordSchema.index({ date: -1 });

export default mongoose.model('ImpactRecord', impactRecordSchema);
