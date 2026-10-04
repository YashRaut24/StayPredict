import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5001;

// Initialize Database Connection
connectDB();

app.listen(PORT, () => {
    console.log('='.repeat(55));
    console.log(`STAYPREDICT: Express Server running on port ${PORT}`);
    console.log(`Endpoint: http://localhost:${PORT}/api/health`);
    console.log('='.repeat(55));
});
