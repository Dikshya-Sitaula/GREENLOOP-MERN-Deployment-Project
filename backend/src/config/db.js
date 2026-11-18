import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`✓ MongoDB connected (${mongoose.connection.name})`);
  } catch (err) {
    console.error('\n✗ Could not connect to MongoDB.');
    console.error('  Is MongoDB running? Check MONGO_URI in backend/.env');
    // never log credentials: mask the user:password part of the URI
    console.error(`  MONGO_URI = ${env.mongoUri.replace(/\/\/[^@/]*@/, '//***:***@')}`);
    console.error(`  Reason: ${err.message}\n`);
    process.exit(1);
  }
}
