import express from 'express';
import { createPrediction, getPredictionHistory, getHealth } from '../controllers/prediction.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected clinical endpoints: Authentication token strictly required
router.post('/predictions', protect, createPrediction);
router.get('/predictions', protect, getPredictionHistory);

// Public health check
router.get('/health', getHealth);

export default router;
