import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { seedDatabase } from './seed.js';

await connectDB();
try {
  await seedDatabase();
  console.log('  Demo login: aarati@demo.np / demo1234');
} catch (err) {
  console.error('✗ Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
