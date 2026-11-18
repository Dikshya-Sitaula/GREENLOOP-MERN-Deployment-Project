import mongoose from 'mongoose';
import { CITIES, CONDITIONS, STATUSES, TYPES } from '../services/catalog.js';

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 90 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    category: { type: String, required: true, trim: true }, // validated against the Category collection
    condition: { type: String, required: true, enum: CONDITIONS },
    type: { type: String, required: true, enum: TYPES },
    price: { type: Number, default: 0, min: 0 },
    wantInReturn: { type: String, default: '', trim: true, maxlength: 140 }, // repair listings: what needs fixing
    wantedCategory: { type: String, default: '', trim: true }, // swap listings: category the owner would like back
    wantedNote: { type: String, default: '', trim: true, maxlength: 140 },
    city: { type: String, required: true, enum: CITIES },
    images: {
      type: [String],
      validate: { validator: (v) => v.length <= 5, message: 'Up to 5 images allowed' },
      default: [],
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: STATUSES, default: 'active' },
    circularityScore: { type: Number, min: 0, max: 100, default: 0 },
    scoreBand: { type: String, default: 'Low' },
    scoreBreakdown: { type: Object, default: {} },
    estimatedKg: { type: Number, default: 0 },
    completedAt: Date,
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

itemSchema.index({ category: 1 });
itemSchema.index({ type: 1 });
itemSchema.index({ city: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ status: 1, createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text' }, { weights: { title: 3, description: 1 } });

export default mongoose.model('Item', itemSchema);
