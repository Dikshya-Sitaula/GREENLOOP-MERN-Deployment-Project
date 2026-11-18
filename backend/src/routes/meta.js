import { Router } from 'express';
import { CITIES, CONDITIONS, TYPES } from '../services/catalog.js';
import Item from '../models/Item.js';
import Category from '../models/Category.js';
import { asyncHandler, ok } from '../utils/http.js';

const router = Router();

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const [docs, counts] = await Promise.all([
      Category.find().sort({ order: 1 }).lean(),
      Item.aggregate([{ $match: { status: 'active' } }, { $group: { _id: '$category', count: { $sum: 1 } } }]),
    ]);
    const categories = docs.map((c) => ({
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      cover: c.cover,
      avgKg: c.avgKg,
      count: counts.find((x) => x._id === c.name)?.count || 0,
    }));
    ok(res, { cities: CITIES, conditions: CONDITIONS, types: TYPES, categories });
  })
);

export default router;
