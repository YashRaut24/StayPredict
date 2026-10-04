import mongoose from 'mongoose';
import Prediction from '../models/Prediction.js';
import { callMLServicePredict, checkMLServiceHealth } from '../services/ml.service.js';

export const createPrediction = async (req, res) => {
    const {
        age,
        gender,
        bloodType,
        medicalCondition,
        insuranceProvider,
        admissionType,
        dateOfAdmission,
        patientName
    } = req.body;

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
                    userId: req.user?.id || null,
                    patientName: patientName || (req.user ? req.user.name : 'Inpatient Record'),
                    patientEmail: req.user ? req.user.email : '',
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
                    prolongedStayRiskPct: mlResponse.prolonged_stay_risk_pct || 0,
                    riskLevel: mlResponse.risk_level || 'Standard Risk',
                    confidenceInterval: {
                        minDays: mlResponse.confidence_interval?.min_days || mlResponse.predicted_stay_days,
                        maxDays: mlResponse.confidence_interval?.max_days || mlResponse.predicted_stay_days
                    },
                    clinicalInterventions: mlResponse.clinical_interventions || [],
                    recoveryRoadmap: mlResponse.recovery_roadmap || [],
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
                prolongedStayRiskPct: mlResponse.prolonged_stay_risk_pct || 0,
                riskLevel: mlResponse.risk_level || 'Standard Risk',
                confidenceInterval: mlResponse.confidence_interval || {
                    min_days: mlResponse.predicted_stay_days,
                    max_days: mlResponse.predicted_stay_days
                },
                clinicalInterventions: mlResponse.clinical_interventions || [],
                recoveryRoadmap: mlResponse.recovery_roadmap || [],
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
        let filter = {};

        // Role-based visibility: Patients only see their own admissions!
        if (req.user && req.user.role === 'patient') {
            filter = {
                $or: [
                    { userId: req.user.id },
                    { patientEmail: req.user.email }
                ]
            };
        }

        const history = await Prediction.find(filter)
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        return res.status(200).json({
            success: true,
            count: history.length,
            role: req.user?.role || 'guest',
            data: history
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve inpatient records: ' + error.message
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
