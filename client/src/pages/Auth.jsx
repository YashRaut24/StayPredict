import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Stethoscope, Building2, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'staff',
    department: 'Emergency & Triage',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup, quickDemoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData);
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role) => {
    setError('');
    setLoading(true);
    try {
      await quickDemoLogin(role);
      navigate(role === 'patient' ? '/patient-portal' : from, { replace: true });
    } catch (err) {
      setError('Demo login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Header */}
        <div className="auth-header">
          <div className="auth-icon-wrap">
            <Building2 size={28} className="auth-brand-icon" />
          </div>
          <h1 className="auth-title">StayPredict Health</h1>
          <p className="auth-subtitle">
            Secure clinical access for Hospital Management, Clinical Staff, and Patients.
          </p>
        </div>

        {/* 1-Click Fast Demo Logins */}
        <div className="demo-login-box">
          <span className="demo-box-label">Instant 1-Click Role Access:</span>
          <div className="demo-btn-grid">
            <button
              type="button"
              className="demo-role-btn btn-staff"
              onClick={() => handleDemoLogin('staff')}
              disabled={loading}
            >
              <Stethoscope size={15} />
              <div className="demo-text">
                <span className="demo-title">Hospital Staff</span>
                <span className="demo-desc">Triage & Admissions</span>
              </div>
            </button>

            <button
              type="button"
              className="demo-role-btn btn-admin"
              onClick={() => handleDemoLogin('admin')}
              disabled={loading}
            >
              <ShieldCheck size={15} />
              <div className="demo-text">
                <span className="demo-title">Hospital Admin</span>
                <span className="demo-desc">Executive Management</span>
              </div>
            </button>

            <button
              type="button"
              className="demo-role-btn btn-patient"
              onClick={() => handleDemoLogin('patient')}
              disabled={loading}
            >
              <User size={15} />
              <div className="demo-text">
                <span className="demo-title">Patient Portal</span>
                <span className="demo-desc">View Personal Stay</span>
              </div>
            </button>
          </div>
        </div>

        <div className="auth-divider">
          <span>Or sign in with email</span>
        </div>

        {/* Toggle Sign In / Register Tabs */}
        <div className="auth-tab-bar">
          <button
            type="button"
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(true); setError(''); }}
          >
            Sign In to Account
          </button>
          <button
            type="button"
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            onClick={() => { setIsLogin(false); setError(''); }}
          >
            Register New Account
          </button>
        </div>

        {error && (
          <div className="auth-error-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <>
              <div className="form-field">
                <label className="field-label">Full Name & Title</label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Eleanor Vance / John Doe"
                  className="auth-input"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Account Role</label>
                <select
                  name="role"
                  className="auth-select"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="staff">Clinical / Nursing Staff (Triage Desk)</option>
                  <option value="admin">Hospital Administrator / Management</option>
                  <option value="patient">Patient or Family Caregiver</option>
                </select>
              </div>

              {formData.role !== 'patient' && (
                <div className="form-field">
                  <label className="field-label">Department / Service Area</label>
                  <input
                    type="text"
                    name="department"
                    placeholder="e.g. Emergency & Triage, ICU, Cardiology"
                    className="auth-input"
                    value={formData.department}
                    onChange={handleChange}
                  />
                </div>
              )}
            </>
          )}

          <div className="form-field">
            <label className="field-label">Work or Personal Email</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@hospital.org or personal@gmail.com"
                className="auth-input with-icon"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-field">
            <label className="field-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="auth-input with-icon"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : isLogin ? 'Sign In to Hospital Portal' : 'Create Verified Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
