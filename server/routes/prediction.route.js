import express from 'express';
import { createPrediction, getPredictionHistory, getHealth } from '../controllers/prediction.controller.js';

const router = express.Router();

router.post('/predictions', createPrediction);
router.get('/predictions', getPredictionHistory);
router.get('/health', getHealth);

export default router;
