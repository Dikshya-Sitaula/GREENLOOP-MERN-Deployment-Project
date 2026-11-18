import mongoose from 'mongoose';

const { ObjectId } = mongoose.Schema.Types;

const swapRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: ObjectId, ref: 'User', required: true },
    toUser: { type: ObjectId, ref: 'User', required: true },
    offeredItem: { type: ObjectId, ref: 'Item', required: true },
    requestedItem: { type: ObjectId, ref: 'Item', required: true },
    message: { type: String, default: '', trim: true, maxlength: 500 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed'], default: 'pending' },
  },
  { timestamps: true }
);

swapRequestSchema.index({ toUser: 1, createdAt: -1 });
swapRequestSchema.index({ fromUser: 1, createdAt: -1 });

export default mongoose.model('SwapRequest', swapRequestSchema);
