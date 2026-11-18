import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Favorite from '../models/Favorite.js';
import SwapRequest from '../models/SwapRequest.js';
import ImpactRecord from '../models/ImpactRecord.js';
import Testimonial from '../models/Testimonial.js';
import ContactMessage from '../models/ContactMessage.js';
import { withCircularity } from '../services/circularityService.js';
import { estimateKg, estimateValue } from '../services/impactService.js';
import { unsplash, TYPES } from '../services/catalog.js';
import { seedCategories } from '../services/categoryService.js';
import { DEMO_PASSWORD, users as userRows, items as itemRows, swapWants, testimonials as testimonialRows } from './data.js';

const DAY = 24 * 60 * 60 * 1000;
const daysAgo = (d) => new Date(Date.now() - d * DAY);

// Deterministic pseudo-random so every seed produces the same demo story.
function rng(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export async function seedDatabase({ log = console.log } = {}) {
  const rand = rng(42);

  await Promise.all([
    User.deleteMany({}),
    Item.deleteMany({}),
    Favorite.deleteMany({}),
    SwapRequest.deleteMany({}),
    ImpactRecord.deleteMany({}),
    Testimonial.deleteMany({}),
    ContactMessage.deleteMany({}),
  ]);

  const categories = await seedCategories();
  const CATEGORY_NAMES = categories.map((c) => c.name);

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const users = await User.insertMany(
    userRows.map((u) => ({ ...u, password: hash, role: u.role || 'user', isDemo: true }))
  );

  const items = await Item.insertMany(
    itemRows.map(([title, category, condition, type, price, city, ownerIdx, imgs, description, wantInReturn, completed], i) => {
      const createdAt = daysAgo(i * 0.7 + rand() * 2);
      return withCircularity({
        title,
        category,
        condition,
        type,
        price: type === 'sell' ? price : 0,
        city,
        owner: users[ownerIdx]._id,
        images: imgs.map((id) => unsplash(id)),
        description,
        wantInReturn: type === 'repair' ? wantInReturn : '',
        wantedCategory: swapWants[title]?.[0] || '',
        wantedNote: swapWants[title]?.[1] || '',
        estimatedKg: estimateKg(category),
        status: completed ? 'completed' : 'active',
        completedAt: completed ? daysAgo(rand() * 20) : undefined,
        isDemo: true,
        createdAt,
        updatedAt: createdAt,
      });
    })
  );

  // Impact: completed demo items + historical records spread over the last 6 months.
  const records = items
    .filter((it) => it.status === 'completed')
    .map((it) => ({
      user: it.owner,
      item: it._id,
      action: it.type,
      category: it.category,
      kg: it.estimatedKg,
      valueNpr: estimateValue(it),
      date: it.completedAt,
    }));

  const regularUsers = users.filter((u) => u.role !== 'admin');
  for (let i = 0; i < 90; i += 1) {
    const category = CATEGORY_NAMES[Math.floor(rand() * CATEGORY_NAMES.length)];
    const action = TYPES[Math.floor(rand() * TYPES.length)];
    // Later months get more activity so the chart shows a growing community.
    const age = Math.floor(Math.pow(rand(), 0.8) * 175);
    const kg = Math.round(estimateKg(category) * (0.6 + rand() * 0.8) * 10) / 10;
    records.push({
      user: i % 6 === 0 ? users[0]._id : regularUsers[Math.floor(rand() * regularUsers.length)]._id,
      action,
      category,
      kg,
      valueNpr: action === 'sell' ? Math.round((estimateValue({ category, price: 0 }) * (0.4 + rand() * 0.6)) / 50) * 50 : 0,
      date: daysAgo(age + 2),
    });
  }
  await ImpactRecord.insertMany(records);

  // A little live activity for the demo account (aarati@demo.np).
  const aarati = users[0];
  const byTitle = (t) => items.find((it) => it.title === t);
  await Favorite.insertMany(
    ['Mountain bike (21 gear)', 'Wooden bookshelf', 'Trekking backpack 50L', 'iPad 9th gen, 64GB'].map((t) => ({
      user: aarati._id,
      item: byTitle(t)._id,
    }))
  );
  await SwapRequest.insertMany([
    {
      fromUser: users[4]._id,
      toUser: aarati._id,
      offeredItem: byTitle('Accent chair')._id,
      requestedItem: byTitle('Plain cotton tees (x4)')._id,
      message: 'Hi Aarati! Would you swap the tees for my accent chair? Happy to bring it over to Baneshwor.',
      status: 'pending',
    },
    {
      fromUser: aarati._id,
      toUser: users[2]._id,
      offeredItem: byTitle('Plain cotton tees (x4)')._id,
      requestedItem: byTitle('Polaroid instant camera')._id,
      message: 'Would love the Polaroid for a trip to Pokhara — would these tees work?',
      status: 'pending',
    },
  ]);

  await Testimonial.insertMany(
    testimonialRows.map(([userIdx, quote, highlight]) => ({ user: users[userIdx]._id, quote, highlight, isDemo: true }))
  );

  log(`✓ Seeded ${users.length} users, ${items.length} items, ${records.length} impact records (demo data)`);
  return { users: users.length, items: items.length };
}

export async function seedIfEmpty() {
  const count = await Item.estimatedDocumentCount();
  if (count === 0) {
    console.log('• Database is empty — seeding demo data…');
    await seedDatabase();
  }
}
