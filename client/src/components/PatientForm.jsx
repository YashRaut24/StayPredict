import React, { useState, useEffect } from 'react';
import { CalendarCheck, RotateCcw, Stethoscope, UserCheck, Users, Mail, User } from 'lucide-react';
import { getRegisteredPatients } from '../services/api';
import './PatientForm.css';

const PRESETS = [
  {
    name: 'Elderly Emergency (Asthma)',
    data: {
      patientName: 'Jane Doe',
      patientEmail: 'patient@staypredict.health',
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
    name: 'Adult Urgent (Oncology / Cancer)',
    data: {
      patientName: 'Arthur Morgan',
      patientEmail: 'arthur@staypredict.health',
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
    name: 'Young Adult Elective (Arthritis)',
    data: {
      patientName: 'Elena Rostova',
      patientEmail: 'elena@staypredict.health',
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
  patientName: 'John Doe',
  patientEmail: 'patient@hospital.org',
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
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadPatients() {
      try {
        const patients = await getRegisteredPatients();
        if (patients && patients.length > 0) {
          setRegisteredPatients(patients);
        }
      } catch (err) {
        console.error('Failed to load registered patients:', err);
      }
    }
    loadPatients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handlePatientSelect = (e) => {
    const selectedEmail = e.target.value;
    if (!selectedEmail) return;

    const matched = registeredPatients.find((p) => p.email === selectedEmail);
    if (matched) {
      setFormData((prev) => ({
        ...prev,
        patientName: matched.name,
        patientEmail: matched.email,
      }));
    }
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
      setError('Please select an admission date.');
      return;
    }

    setError('');
    onSubmit(formData);
  };

  return (
    <div className="patient-form-card">
      <div className="form-header">
        <h2 className="form-title">Inpatient Admission Details</h2>
        <p className="form-subtitle">
          Record initial patient admission parameters to generate bed allocation timelines, prolonged stay risk assessment, and personalized recovery roadmaps.
        </p>
      </div>

      {/* Patient Account Link Banner */}
      <div className="patient-link-banner">
        <div className="patient-link-header">
          <UserCheck size={16} className="link-icon" />
          <span className="link-heading">Patient Account Linking & Identity</span>
        </div>
        <p className="link-subheading">
          Select an existing registered patient or enter their login email so their AI Length of Stay plan automatically syncs to their Patient Portal.
        </p>

        <div className="link-inputs-grid">
          {registeredPatients.length > 0 && (
            <div className="form-group link-group-full">
              <label htmlFor="registeredPatientSelect" className="form-label">
                Quick Select Registered Patient:
              </label>
              <select
                id="registeredPatientSelect"
                className="form-select"
                onChange={handlePatientSelect}
                value={formData.patientEmail || ''}
              >
                <option value="">-- Choose from {registeredPatients.length} registered patient accounts --</option>
                {registeredPatients.map((p) => (
                  <option key={p.email} value={p.email}>
                    {p.name} ({p.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="patientName" className="form-label">
              Patient Full Name <span className="required">*</span>
            </label>
            <input
              id="patientName"
              name="patientName"
              type="text"
              className="form-input"
              value={formData.patientName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="patientEmail" className="form-label">
              Patient Login Email (for Portal Sync)
            </label>
            <input
              id="patientEmail"
              name="patientEmail"
              type="email"
              className="form-input"
              value={formData.patientEmail}
              onChange={handleChange}
              placeholder="e.g. patient@hospital.org"
            />
          </div>
        </div>
      </div>

      <div className="preset-bar">
        <span className="preset-label">
          <Stethoscope size={14} /> Quick Clinical Presets:
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
              Blood Group <span className="required">*</span>
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
              Primary Diagnosis <span className="required">*</span>
            </label>
            <select
              id="medicalCondition"
              name="medicalCondition"
              required
              className="form-select"
              value={formData.medicalCondition}
              onChange={handleChange}
            >
              <option value="Asthma">Asthma Management</option>
              <option value="Diabetes">Diabetes & Metabolic Crisis</option>
              <option value="Cancer">Oncology & Chemotherapy</option>
              <option value="Hypertension">Hypertension Crisis</option>
              <option value="Arthritis">Arthritis & Joint Replacement</option>
              <option value="Obesity">Severe Obesity & Metabolic Care</option>
            </select>
          </div>

          {/* Insurance Provider */}
          <div className="form-group">
            <label htmlFor="insuranceProvider" className="form-label">
              Payer / Insurance Provider <span className="required">*</span>
            </label>
            <select
              id="insuranceProvider"
              name="insuranceProvider"
              required
              className="form-select"
              value={formData.insuranceProvider}
              onChange={handleChange}
            >
              <option value="Medicare">Medicare</option>
              <option value="Medicaid">Medicaid</option>
              <option value="Blue Cross">Blue Cross</option>
              <option value="Aetna">Aetna</option>
              <option value="UnitedHealthcare">UnitedHealthcare</option>
              <option value="Cigna">Cigna</option>
            </select>
          </div>

          {/* Admission Type */}
          <div className="form-group">
            <label htmlFor="admissionType" className="form-label">
              Admission Urgency <span className="required">*</span>
            </label>
            <select
              id="admissionType"
              name="admissionType"
              required
              className="form-select"
              value={formData.admissionType}
              onChange={handleChange}
            >
              <option value="Emergency">Emergency (Immediate stabilization)</option>
              <option value="Urgent">Urgent (Unscheduled acute care)</option>
              <option value="Elective">Elective (Planned procedural intake)</option>
            </select>
          </div>

          {/* Date of Admission */}
          <div className="form-group form-group-full">
            <label htmlFor="dateOfAdmission" className="form-label">
              Date of Admission <span className="required">*</span>
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
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-reset"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw size={15} /> Reset Form
          </button>

          <button
            type="submit"
            className="btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-text">Evaluating Random Forest Model...</span>
            ) : (
              <>
                <CalendarCheck size={16} /> Admit & Plan Inpatient Stay
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
