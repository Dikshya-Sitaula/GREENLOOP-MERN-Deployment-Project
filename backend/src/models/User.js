import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { CITIES } from '../services/catalog.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8, select: false },
    city: { type: String, enum: CITIES, default: 'Kathmandu' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 280 },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
