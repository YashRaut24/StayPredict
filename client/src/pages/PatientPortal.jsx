import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getPredictionHistory } from '../services/api';
import { Calendar, Clock, BedDouble, CheckCircle2, AlertCircle, Phone, FileText, HeartPulse, ChevronRight, User } from 'lucide-react';
import './PatientPortal.css';

export default function PatientPortal() {
  const { user } = useAuth();
  const [patientRecord, setPatientRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Checklist state
  const [checklist, setChecklist] = useState([
    { id: 1, text: 'Confirm personal discharge transportation with family or caregiver', done: true },
    { id: 2, text: 'Review take-home medications and schedule with ward pharmacist', done: false },
    { id: 3, text: 'Schedule post-discharge outpatient clinic consultation', done: false },
    { id: 4, text: 'Receive formal discharge summary and emergency contact sheet', done: false },
  ]);

  const toggleCheck = (id) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  };

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getPredictionHistory();
        if (res.data && res.data.length > 0) {
          setPatientRecord(res.data[0]);
        }
      } catch (err) {
        console.error('Failed to load patient stay data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const input = patientRecord?.inputFeatures || {
    medicalCondition: 'Asthma Management',
    admissionType: 'Emergency',
    dateOfAdmission: new Date().toISOString().split('T')[0],
  };

  const stayDays = patientRecord ? Number(patientRecord.predictedStayDays) : 5.5;

  let dischargeDateStr = 'Pending evaluation';
  if (input.dateOfAdmission) {
    const d = new Date(input.dateOfAdmission);
    d.setDate(d.getDate() + Math.round(stayDays));
    dischargeDateStr = d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  return (
    <div className="patient-portal-page">
      {/* Welcome Banner */}
      <section className="portal-header-card">
        <div className="portal-header-left">
          <div className="patient-avatar-box">
            <User size={32} />
          </div>
          <div>
            <span className="portal-badge">Patient & Family Care Portal</span>
            <h1 className="portal-title">Welcome, {user?.name || 'Valued Patient'}</h1>
            <p className="portal-desc">
              Track your scheduled recovery trajectory, anticipated discharge date, and care preparation checklist.
            </p>
          </div>
        </div>
        <div className="patient-meta-pill">
          <span className="meta-label">Primary Care Unit:</span>
          <span className="meta-val">Acute Medical — Room 304</span>
        </div>
      </section>

      {/* Main Stay Metrics */}
      <div className="portal-grid">
        {/* Left Column: Stay Timeline & Care Plan */}
        <div className="portal-col-main">
          <div className="stay-summary-card">
            <div className="stay-summary-header">
              <h2 className="card-title">Inpatient Stay Timeline</h2>
              <span className="active-badge">Active Inpatient Plan</span>
            </div>

            <div className="stay-highlight-box">
              <div className="highlight-item">
                <span className="hl-label">Target Discharge Date</span>
                <span className="hl-value-primary">{dischargeDateStr}</span>
                <span className="hl-note">Subject to morning clinical rounds confirmation</span>
              </div>
              <div className="highlight-divider"></div>
              <div className="highlight-item">
                <span className="hl-label">Expected Care Duration</span>
                <span className="hl-value-secondary">{stayDays.toFixed(1)} Days</span>
                <span className="hl-note">Clinical benchmark for {input.medicalCondition}</span>
              </div>
            </div>

            {/* Admission Details */}
            <div className="admission-specs-table">
              <div className="spec-item">
                <span className="spec-label">Admission Date:</span>
                <span className="spec-val">{input.dateOfAdmission}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Primary Diagnosis:</span>
                <span className="spec-val">{input.medicalCondition}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Admission Urgency:</span>
                <span className="spec-val">{input.admissionType}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Payer Authorization:</span>
                <span className="spec-val">{input.insuranceProvider || 'Covered'}</span>
              </div>
            </div>
          </div>

          {/* Recovery Milestones Stepper */}
          <div className="milestones-card">
            <h3 className="card-title">Your Inpatient Care Milestones</h3>
            <p className="card-subtitle">Key clinical phases prior to returning home</p>

            <div className="milestone-steps">
              <div className="step-item step-completed">
                <div className="step-marker">✓</div>
                <div className="step-content">
                  <span className="step-title">Initial Triage & Ward Bed Placement</span>
                  <p className="step-desc">Admission intake completed, initial diagnostic baseline recorded, and bed allocated.</p>
                </div>
              </div>

              <div className="step-item step-current">
                <div className="step-marker">2</div>
                <div className="step-content">
                  <span className="step-title">Active Clinical Therapy & Stabilization</span>
                  <p className="step-desc">Ongoing vital sign monitoring, medication regimen, and multidisciplinary progress reviews.</p>
                </div>
              </div>

              <div className="step-item step-upcoming">
                <div className="step-marker">3</div>
                <div className="step-content">
                  <span className="step-title">Pre-Discharge Pharmacy Reconciliation</span>
                  <p className="step-desc">48-hour medication review, outpatient transition instructions, and discharge clearance.</p>
                </div>
              </div>

              <div className="step-item step-upcoming">
                <div className="step-marker">4</div>
                <div className="step-content">
                  <span className="step-title">Discharge Day & Outpatient Handover</span>
                  <p className="step-desc">Final attending physician sign-off, take-home packet handover, and follow-up appointment confirmation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Discharge Checklist & Contacts */}
        <div className="portal-col-side">
          <div className="checklist-card">
            <h3 className="card-title">Discharge Readiness Checklist</h3>
            <p className="card-subtitle">Steps you and your family can complete before departure</p>

            <div className="checklist-items">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`check-row ${item.done ? 'checked' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}}
                    className="check-input"
                  />
                  <span className="check-text">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hospital-support-card">
            <h4 className="support-title">Need Assistance?</h4>
            <p className="support-desc">
              Your care team is available 24/7. Use your bedside call button or contact nursing reception.
            </p>
            <div className="support-contact">
              <Phone size={16} className="contact-icon" />
              <span>Ward Nursing Desk: Ext. 4410</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
