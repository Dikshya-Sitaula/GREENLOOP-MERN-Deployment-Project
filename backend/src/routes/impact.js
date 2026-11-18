import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import { asyncHandler, ok } from '../utils/http.js';
import { assumptions, globalImpact, userImpact } from '../services/impactService.js';
import { SCORE_MAX } from '../services/circularityService.js';

const router = Router();

router.get('/global', asyncHandler(async (req, res) => ok(res, await globalImpact())));
router.get('/me', protect, asyncHandler(async (req, res) => ok(res, await userImpact(req.user._id))));
router.get('/assumptions', asyncHandler(async (req, res) => ok(res, { ...(await assumptions()), scoreMax: SCORE_MAX })));

export default router;
