import mongoose from 'mongoose';
import ImpactRecord from '../models/ImpactRecord.js';
import Item from '../models/Item.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import { getCategory } from './categoryService.js';

// Assumption: reusing an item avoids roughly 2.5 kg CO2e per kg of new goods produced.
export const CO2_PER_KG = 2.5;

export const LEVELS = [
  { name: 'Seedling', min: 0 },
  { name: 'Sprout', min: 40 },
  { name: 'Grower', min: 120 },
  { name: 'Looper', min: 300 },
  { name: 'Circular Champion', min: 600 },
];

export function estimateKg(category) {
  return getCategory(category)?.avgKg ?? 1;
}

export function estimateValue(item) {
  if (item.price > 0) return item.price;
  return getCategory(item.category)?.avgValue ?? 0;
}

const round1 = (n) => Math.round(n * 10) / 10;

// Called when an owner marks an item completed. Idempotent per item+user.
export async function recordCompletion(item, userId = item.owner) {
  const existing = await ImpactRecord.findOne({ item: item._id, user: userId });
  if (existing) return existing;
  return ImpactRecord.create({
    user: userId,
    item: item._id,
    action: item.type,
    category: item.category,
    kg: item.estimatedKg || estimateKg(item.category),
    valueNpr: estimateValue(item),
    date: new Date(),
  });
}

async function summarize(match) {
  const [totals] = await ImpactRecord.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        itemsReused: { $sum: 1 },
        kg: { $sum: '$kg' },
        valueNpr: { $sum: '$valueNpr' },
        swaps: { $sum: { $cond: [{ $eq: ['$action', 'swap'] }, 1, 0] } },
        donations: { $sum: { $cond: [{ $eq: ['$action', 'donate'] }, 1, 0] } },
        repairs: { $sum: { $cond: [{ $eq: ['$action', 'repair'] }, 1, 0] } },
        sales: { $sum: { $cond: [{ $eq: ['$action', 'sell'] }, 1, 0] } },
      },
    },
  ]);
  const t = totals || { itemsReused: 0, kg: 0, valueNpr: 0, swaps: 0, donations: 0, repairs: 0, sales: 0 };
  delete t._id;
  t.kg = round1(t.kg);
  t.co2Kg = round1(t.kg * CO2_PER_KG);
  return t;
}

async function monthly(match, months = 6) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (months - 1));

  const rows = await ImpactRecord.aggregate([
    { $match: { ...match, date: { $gte: start } } },
    {
      $group: {
        _id: { y: { $year: '$date' }, m: { $month: '$date' } },
        kg: { $sum: '$kg' },
        items: { $sum: 1 },
        valueNpr: { $sum: '$valueNpr' },
      },
    },
  ]);

  return Array.from({ length: months }, (_, i) => {
    const d = new Date(start);
    d.setMonth(start.getMonth() + i);
    const hit = rows.find((r) => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1);
    return {
      month: d.toLocaleString('en-US', { month: 'short' }),
      kg: round1(hit?.kg || 0),
      items: hit?.items || 0,
      valueNpr: hit?.valueNpr || 0,
    };
  });
}

async function byAction(match) {
  const rows = await ImpactRecord.aggregate([
    { $match: match },
    { $group: { _id: '$action', count: { $sum: 1 }, kg: { $sum: '$kg' } } },
  ]);
  return ['sell', 'swap', 'donate', 'repair'].map((action) => {
    const r = rows.find((x) => x._id === action);
    return { action, count: r?.count || 0, kg: round1(r?.kg || 0) };
  });
}

export function levelFor(points) {
  let idx = 0;
  LEVELS.forEach((l, i) => {
    if (points >= l.min) idx = i;
  });
  const current = LEVELS[idx];
  const next = LEVELS[idx + 1] || null;
  const progress = next ? Math.round(((points - current.min) / (next.min - current.min)) * 100) : 100;
  return { name: current.name, index: idx, points, next: next?.name || null, nextAt: next?.min || null, progress, all: LEVELS };
}

function badgesFor(t) {
  return [
    { key: 'first-loop', name: 'First Loop', description: 'Completed your first circular action', earned: t.itemsReused >= 1 },
    { key: 'swapper', name: 'Swapper', description: 'Completed a swap', earned: t.swaps >= 1 },
    { key: 'giver', name: 'Giver', description: 'Donated an item', earned: t.donations >= 1 },
    { key: 'fixer', name: 'Fixer', description: 'Gave something a repair', earned: t.repairs >= 1 },
    { key: 'ten-kg', name: '10 kg Diverted', description: 'Kept 10 kg out of landfill', earned: t.kg >= 10 },
    { key: 'fifty-kg', name: '50 kg Diverted', description: 'Kept 50 kg out of landfill', earned: t.kg >= 50 },
  ];
}

export async function globalImpact() {
  const [totals, series, actions, members, activeListings] = await Promise.all([
    summarize({}),
    monthly({}),
    byAction({}),
    User.countDocuments(),
    Item.countDocuments({ status: 'active' }),
  ]);
  return { totals: { ...totals, members, activeListings }, monthly: series, byAction: actions, estimated: true };
}

export async function userImpact(userId) {
  const match = { user: new mongoose.Types.ObjectId(String(userId)) };
  const [totals, series, actions] = await Promise.all([summarize(match), monthly(match), byAction(match)]);
  const points = Math.round(totals.itemsReused * 10 + totals.kg * 2);
  return { totals, monthly: series, byAction: actions, level: levelFor(points), badges: badgesFor(totals), estimated: true };
}

export async function assumptions() {
  const categories = await Category.find().sort({ order: 1 }).select('name avgKg avgValue').lean();
  return { co2PerKg: CO2_PER_KG, categories: categories.map(({ name, avgKg, avgValue }) => ({ name, avgKg, avgValue })) };
}
