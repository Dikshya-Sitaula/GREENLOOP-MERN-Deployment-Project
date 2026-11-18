import { Router } from 'express';
import * as favorites from '../controllers/favoriteController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();
router.use(protect);
router.get('/', asyncHandler(favorites.list));
router.post('/:itemId', asyncHandler(favorites.toggle));

export default router;
