import express from 'express';
import { createPrediction, getPredictionHistory, getHealth } from '../controllers/prediction.controller.js';
import { optionalAuth } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/predictions', optionalAuth, createPrediction);
router.get('/predictions', optionalAuth, getPredictionHistory);
router.get('/health', getHealth);

export default router;
