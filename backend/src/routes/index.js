import { Router } from 'express';
import mongoose from 'mongoose';
import { ok } from '../utils/http.js';
import authRoutes from './auth.js';
import metaRoutes from './meta.js';
import itemRoutes from './items.js';
import favoriteRoutes from './favorites.js';
import swapRoutes from './swaps.js';
import impactRoutes from './impact.js';
import communityRoutes from './community.js';

const router = Router();

router.get('/health', (req, res) =>
  ok(res, { status: 'up', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected', time: new Date() })
);

router.use('/auth', authRoutes);
router.use('/meta', metaRoutes);
router.use('/items', itemRoutes);
router.use('/favorites', favoriteRoutes);
router.use('/swaps', swapRoutes);
router.use('/impact', impactRoutes);
router.use('/', communityRoutes);

export default router;
