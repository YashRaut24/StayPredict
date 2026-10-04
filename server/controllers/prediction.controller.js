import mongoose from 'mongoose';
import Prediction from '../models/Prediction.js';
import { callMLServicePredict, checkMLServiceHealth } from '../services/ml.service.js';

export const createPrediction = async (req, res) => {
    const { age, gender, bloodType, medicalCondition, insuranceProvider, admissionType, dateOfAdmission } = req.body;

    // Basic validation at Express Gateway
    if (!age || !gender || !bloodType || !medicalCondition || !insuranceProvider || !admissionType || !dateOfAdmission) {
        return res.status(400).json({
            success: false,
            message: 'All 7 pre-admission clinical fields are required: age, gender, bloodType, medicalCondition, insuranceProvider, admissionType, dateOfAdmission.'
        });
    }

    try {
        // 1. Call FastAPI ML Service
        const mlResponse = await callMLServicePredict(req.body);

        let savedRecord = null;

        // 2. Persist to MongoDB if connected
        if (mongoose.connection.readyState === 1) {
            try {
                savedRecord = await Prediction.create({
                    inputFeatures: {
                        age: Number(age),
                        gender,
                        bloodType,
                        medicalCondition,
                        insuranceProvider,
                        admissionType,
                        dateOfAdmission
                    },
                    predictedStayDays: mlResponse.predicted_stay_days,
                    modelVersion: mlResponse.model_version,
                    modelName: mlResponse.model_name
                });
            } catch (dbErr) {
                console.warn('Could not save prediction to MongoDB:', dbErr.message);
            }
        }

        // 3. Return response to client
        return res.status(200).json({
            success: true,
            data: {
                predictedStayDays: mlResponse.predicted_stay_days,
                modelVersion: mlResponse.model_version,
                modelName: mlResponse.model_name,
                historyId: savedRecord ? savedRecord._id : null,
                persisted: !!savedRecord
            }
        });
    } catch (error) {
        console.error('Prediction controller error:', error.message);
        return res.status(502).json({
            success: false,
            message: error.message
        });
    }
};

export const getPredictionHistory = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.status(200).json({
            success: true,
            count: 0,
            data: [],
            note: 'Database disconnected. Operating in stateless demo mode.'
        });
    }

    try {
        const history = await Prediction.find()
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return res.status(200).json({
            success: true,
            count: history.length,
            data: history
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve prediction history: ' + error.message
        });
    }
};

export const getHealth = async (req, res) => {
    const mlHealth = await checkMLServiceHealth();

    return res.status(200).json({
        status: 'healthy',
        backend: 'StayPredict Express API',
        database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        mlService: mlHealth,
        timestamp: new Date().toISOString()
    });
};
