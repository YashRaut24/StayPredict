import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ['patient', 'staff', 'admin'],
            default: 'patient'
        },
        department: {
            type: String,
            default: 'General Inpatient'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model('User', UserSchema);
