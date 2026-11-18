import { Router } from 'express';
import { body, param } from 'express-validator';
import * as swaps from '../controllers/swapController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { asyncHandler } from '../utils/http.js';

const router = Router();
router.use(protect);

router.get('/', asyncHandler(swaps.mine));
router.get('/matches/:itemId', validate([param('itemId').isMongoId().withMessage('Invalid item')]), asyncHandler(swaps.matches));
router.post(
  '/',
  validate([
    body('offeredItem').isMongoId().withMessage('Choose one of your items to offer'),
    body('requestedItem').isMongoId().withMessage('Choose an item to request'),
    body('message').optional().trim().isLength({ max: 500 }).withMessage('Keep your message under 500 characters'),
  ]),
  asyncHandler(swaps.create)
);
router.patch(
  '/:id',
  validate([body('status').isIn(['accepted', 'rejected']).withMessage('Status must be accepted or rejected')]),
  asyncHandler(swaps.respond)
);

export default router;
