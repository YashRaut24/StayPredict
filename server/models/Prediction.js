import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        patientName: {
            type: String,
            default: 'Inpatient Record'
        },
        patientEmail: {
            type: String,
            default: ''
        },
        doctorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        doctorName: {
            type: String,
            default: ''
        },
        inputFeatures: {
            age: { type: Number, required: true },
            gender: { type: String, required: true },
            bloodType: { type: String, required: true },
            medicalCondition: { type: String, required: true },
            insuranceProvider: { type: String, required: true },
            admissionType: { type: String, required: true },
            dateOfAdmission: { type: String, required: true }
        },
        predictedStayDays: {
            type: Number,
            required: true
        },
        prolongedStayRiskPct: {
            type: Number,
            default: 0
        },
        riskLevel: {
            type: String,
            default: 'Standard Risk'
        },
        confidenceInterval: {
            minDays: { type: Number, default: 0 },
            maxDays: { type: Number, default: 0 }
        },
        clinicalInterventions: {
            type: [String],
            default: []
        },
        recoveryRoadmap: {
            type: [mongoose.Schema.Types.Mixed],
            default: []
        },
        modelVersion: {
            type: String,
            default: '1.0.0'
        },
        modelName: {
            type: String,
            default: 'Random Forest Regressor'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('Prediction', PredictionSchema);
