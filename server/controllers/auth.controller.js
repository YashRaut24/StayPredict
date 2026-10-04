import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'staypredict_clinical_jwt_secret_2026';

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            department: user.department
        },
        JWT_SECRET,
        { expiresIn: '7d' }
    );
};

export const signup = async (req, res) => {
    const { name, email, password, role = 'patient', department = 'General Inpatient' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required.'
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'An account with this email address already exists.'
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const validRole = ['patient', 'staff', 'admin'].includes(role) ? role : 'patient';

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: validRole,
            department
        });

        const token = generateToken(user);

        return res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department
                },
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Registration failed: ' + error.message
        });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required.'
        });
    }

    try {
        const normalizedEmail = email.toLowerCase().trim();
        let user = await User.findOne({ email: normalizedEmail });

        // Auto-seed default demo accounts if not found for seamless testing!
        if (!user && (normalizedEmail.includes('@staypredict.health') || normalizedEmail.includes('demo'))) {
            let demoRole = 'patient';
            let demoName = 'Jane Doe (Patient)';
            if (normalizedEmail.includes('admin')) {
                demoRole = 'admin';
                demoName = 'Dr. Robert Vance (Chief Medical Officer)';
            } else if (normalizedEmail.includes('staff')) {
                demoRole = 'staff';
                demoName = 'Nurse Sarah Jenkins (Triage Coordinator)';
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password || 'password123', salt);
            user = await User.create({
                name: demoName,
                email: normalizedEmail,
                password: hashedPassword,
                role: demoRole,
                department: demoRole === 'admin' ? 'Hospital Administration' : demoRole === 'staff' ? 'Emergency & Inpatient Triage' : 'Inpatient Care'
            });
        }

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    department: user.department
                },
                token
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Login failed: ' + error.message
        });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User account not found.'
            });
        }
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
