import mongoose from 'mongoose';

const PredictionSchema = new mongoose.Schema(
    {
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
