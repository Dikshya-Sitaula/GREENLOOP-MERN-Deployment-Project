import mongoose from 'mongoose';

// Marketplace categories. `avgKg`/`avgValue` drive impact estimates; `longevity`,
// `repairability` and `demand` are the circularity-score inputs (see circularityService).
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, default: 'Package' },
    cover: { type: String, default: '' },
    avgKg: { type: Number, required: true, min: 0 },
    avgValue: { type: Number, default: 0, min: 0 },
    longevity: { type: Number, required: true, min: 0, max: 25 },
    repairability: { type: Number, required: true, min: 0, max: 15 },
    demand: { type: Number, required: true, min: 0, max: 15 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Category', categorySchema);
