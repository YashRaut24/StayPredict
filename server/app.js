import express from 'express';
import cors from 'cors';
import predictionRoutes from './routes/prediction.route.js';
import authRoutes from './routes/auth.route.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', predictionRoutes);
app.use('/api/auth', authRoutes);

// Root route
app.get('/', (req, res) => {
    res.json({
        name: 'StayPredict Hospital Operations API',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

export default app;
