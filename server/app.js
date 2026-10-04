import express from 'express';
import cors from 'cors';
import predictionRoutes from './routes/prediction.route.js';

const app = express();

// Middlewares
app.addMiddleware = app.use;
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', predictionRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'StayPredict Application API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

export default app;
