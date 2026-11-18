import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quote: { type: String, required: true, maxlength: 400 },
    highlight: { type: String, default: '' },
    isDemo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', testimonialSchema);
