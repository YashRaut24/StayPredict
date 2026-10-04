import React, { useState } from 'react';
import { Send, RotateCcw, Sparkles } from 'lucide-react';
import './PatientForm.css';

const PRESETS = [
  {
    name: 'Elderly Emergency (Asthma)',
    data: {
      age: 68,
      gender: 'Female',
      bloodType: 'O+',
      medicalCondition: 'Asthma',
      insuranceProvider: 'Medicare',
      admissionType: 'Emergency',
      dateOfAdmission: new Date().toISOString().split('T')[0],
    },
  },
  {
    name: 'Adult Urgent (Cancer)',
    data: {
      age: 54,
      gender: 'Male',
      bloodType: 'A+',
      medicalCondition: 'Cancer',
      insuranceProvider: 'Blue Cross',
      admissionType: 'Urgent',
      dateOfAdmission: new Date().toISOString().split('T')[0],
    },
  },
  {
    name: 'Young Elective (Arthritis)',
    data: {
      age: 29,
      gender: 'Female',
      bloodType: 'B-',
      medicalCondition: 'Arthritis',
      insuranceProvider: 'Cigna',
      admissionType: 'Elective',
      dateOfAdmission: new Date().toISOString().split('T')[0],
    },
  },
];

const INITIAL_STATE = {
  age: 45,
  gender: 'Male',
  bloodType: 'O+',
  medicalCondition: 'Diabetes',
  insuranceProvider: 'Aetna',
  admissionType: 'Emergency',
  dateOfAdmission: new Date().toISOString().split('T')[0],
};

export default function PatientForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const applyPreset = (presetData) => {
    setFormData(presetData);
    setError('');
  };

  const handleReset = () => {
    setFormData(INITIAL_STATE);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.age || formData.age < 1 || formData.age > 120) {
      setError('Please provide a realistic patient age between 1 and 120.');
      return;
    }
    if (!formData.dateOfAdmission) {
      setError('Please specify the date of admission.');
      return;
    }

    setError('');
    onSubmit(formData);
  };

  return (
    <div className="patient-form-card">
      <div className="form-header">
        <h2 className="form-title">Patient Clinical Admission Data</h2>
        <p className="form-subtitle">
          Input strictly pre-admission clinical indicators. All post-admission variables are excluded to prevent target leakage.
        </p>
      </div>

      <div className="preset-bar">
        <span className="preset-label">
          <Sparkles size={14} /> Quick Demo Presets:
        </span>
        <div className="preset-buttons">
          {PRESETS.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              className="preset-btn"
              onClick={() => applyPreset(preset.data)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="form-error-alert">{error}</div>}

      <form onSubmit={handleSubmit} className="clinical-form">
        <div className="form-grid">
          {/* Age */}
          <div className="form-group">
            <label htmlFor="age" className="form-label">
              Patient Age (Years) <span className="required">*</span>
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="1"
              max="120"
              required
              className="form-input"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 52"
            />
          </div>

          {/* Gender */}
          <div className="form-group">
            <label htmlFor="gender" className="form-label">
              Gender <span className="required">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              required
              className="form-select"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          {/* Blood Type */}
          <div className="form-group">
            <label htmlFor="bloodType" className="form-label">
              Blood Type <span className="required">*</span>
            </label>
            <select
              id="bloodType"
              name="bloodType"
              required
              className="form-select"
              value={formData.bloodType}
              onChange={handleChange}
            >
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          {/* Medical Condition */}
          <div className="form-group">
            <label htmlFor="medicalCondition" className="form-label">
              Primary Diagnosis / Condition <span className="required">*</span>
            </label>
            <select
              id="medicalCondition"
              name="medicalCondition"
              required
              className="form-select"
              value={formData.medicalCondition}
              onChange={handleChange}
            >
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Asthma">Asthma</option>
              <option value="Arthritis">Arthritis</option>
              <option value="Cancer">Cancer</option>
              <option value="Obesity">Obesity</option>
            </select>
          </div>

          {/* Admission Type */}
          <div className="form-group">
            <label htmlFor="admissionType" className="form-label">
              Admission Acuity <span className="required">*</span>
            </label>
            <select
              id="admissionType"
              name="admissionType"
              required
              className="form-select"
              value={formData.admissionType}
              onChange={handleChange}
            >
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Elective">Elective</option>
            </select>
          </div>

          {/* Insurance Provider */}
          <div className="form-group">
            <label htmlFor="insuranceProvider" className="form-label">
              Insurance Provider <span className="required">*</span>
            </label>
            <select
              id="insuranceProvider"
              name="insuranceProvider"
              required
              className="form-select"
              value={formData.insuranceProvider}
              onChange={handleChange}
            >
              <option value="Aetna">Aetna</option>
              <option value="Blue Cross">Blue Cross</option>
              <option value="Cigna">Cigna</option>
              <option value="Medicare">Medicare</option>
              <option value="UnitedHealthcare">UnitedHealthcare</option>
            </select>
          </div>

          {/* Date of Admission */}
          <div className="form-group form-group-full">
            <label htmlFor="dateOfAdmission" className="form-label">
              Admission Date <span className="required">*</span>
            </label>
            <input
              id="dateOfAdmission"
              name="dateOfAdmission"
              type="date"
              required
              className="form-input"
              value={formData.dateOfAdmission}
              onChange={handleChange}
            />
            <span className="field-hint">
              Extracts Year, Month, Day, and Day of Week for temporal admission pattern modeling.
            </span>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={15} /> Reset
          </button>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="btn-loading">Inferring LOS...</span>
            ) : (
              <>
                <Send size={15} /> Compute Predicted Stay
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
