import mongoose from 'mongoose';

export const connectDB = async () => {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/staypredict';

    try {
        const conn = await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000 // Quick timeout to prevent hanging if MongoDB is not running locally
        });
        console.log(`✓ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.warn(`! MongoDB Connection Warning: ${error.message}`);
        console.warn('  (Server will continue in stateless mode: predictions will work without history persistence)');
    }
};
