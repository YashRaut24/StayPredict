import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPredictionHistory } from '../services/api';
import {
  Calendar,
  Clock,
  BedDouble,
  CheckCircle2,
  AlertCircle,
  Phone,
  FileText,
  HeartPulse,
  User,
  HelpCircle,
  Activity,
  ShieldCheck,
  Stethoscope,
  Info,
  CalendarCheck,
  Building2,
  ArrowRight
} from 'lucide-react';
import RedFlagAlerts from '../components/RedFlagAlerts';
import MedicationSchedule from '../components/MedicationSchedule';
import './PatientPortal.css';

export default function PatientPortal() {
  const { user } = useAuth();
  const [patientRecord, setPatientRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  // Patient checklist state
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
          // Real admission found for this patient
          setPatientRecord(res.data[0]);
        } else {
          setPatientRecord(null);
        }
      } catch (err) {
        console.error('Failed to load patient stay data:', err);
        setPatientRecord(null);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  // Loading state
  if (loading) {
    return (
      <div className="patient-portal-page">
        <div className="portal-loading-card">
          <Activity size={28} className="loading-icon spinning" />
          <h2 className="loading-title">Retrieving Inpatient Medical Records...</h2>
          <p className="loading-desc">Synchronizing with hospital admission registry and clinical length-of-stay engine.</p>
        </div>
      </div>
    );
  }

  // Real state: Patient has NOT been admitted by a doctor yet
  if (!patientRecord) {
    return (
      <div className="patient-portal-page">
        {/* Header */}
        <section className="portal-header-card">
          <div className="portal-header-left">
            <div className="patient-avatar-box">
              <User size={32} />
            </div>
            <div>
              <span className="portal-badge badge-outpatient">Outpatient Account Active</span>
              <h1 className="portal-title">Welcome, {user?.name || 'Valued Patient'}</h1>
              <p className="portal-desc">
                Hospital Patient Account: <strong>{user?.email}</strong>
              </p>
            </div>
          </div>
          <div className="patient-meta-pill">
            <span className="meta-label">Clinical Status:</span>
            <span className="meta-val status-awaiting">Awaiting Inpatient Admission Intake</span>
          </div>
        </section>

        {/* Informative Notice: No Active Inpatient Admission On File */}
        <div className="no-admission-card">
          <div className="no-admission-content">
            <div className="no-admission-icon-box">
              <AlertCircle size={32} />
            </div>
            <div className="no-admission-text">
              <h2 className="no-admission-title">No Active Inpatient Admission On File</h2>
              <p className="no-admission-lead">
                Your patient account is registered in our hospital system under <strong>{user?.email}</strong>, but an attending physician or triage coordinator has not yet submitted an inpatient admission assessment for you.
              </p>
              <div className="no-admission-steps">
                <div className="step-item-box">
                  <span className="step-num-pill">1</span>
                  <div>
                    <strong>Clinical Triage Assessment:</strong>
                    <p>When you arrive at the hospital, your clinical care team records your admission parameters (urgency, diagnosis, vital acuity).</p>
                  </div>
                </div>
                <div className="step-item-box">
                  <span className="step-num-pill">2</span>
                  <div>
                    <strong>ML Length of Stay Generation:</strong>
                    <p>The admitting doctor evaluates your expected stay trajectory using the Random Forest clinical model.</p>
                  </div>
                </div>
                <div className="step-item-box">
                  <span className="step-num-pill">3</span>
                  <div>
                    <strong>Portal Activation:</strong>
                    <p>Once admitted, your target discharge date, personalized 4-phase recovery roadmap, and take-home medications will automatically activate on this page.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registered Outpatient Details Card */}
        <div className="outpatient-profile-card">
          <h3 className="profile-heading">Registered Patient Profile</h3>
          <div className="profile-specs-grid">
            <div className="spec-box">
              <span className="spec-label">Patient Name:</span>
              <span className="spec-val">{user?.name}</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Registered Email:</span>
              <span className="spec-val">{user?.email}</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Assigned Department:</span>
              <span className="spec-val">{user?.department || 'General Patient'}</span>
            </div>
            <div className="spec-box">
              <span className="spec-label">Inpatient Census Record:</span>
              <span className="spec-val text-pending">Pending Doctor Admission</span>
            </div>
          </div>
        </div>

        {/* Testing & Doctor Linking Guidance */}
        <div className="testing-guidance-card">
          <div className="guidance-header">
            <Stethoscope size={20} className="guidance-icon" />
            <h4 className="guidance-title">Doctor Admission Workflow (How It Works)</h4>
          </div>
          <p className="guidance-body">
            To view a live personalized stay plan for this account, a clinical staff member or physician must admit <strong>{user?.email}</strong> in the hospital system.
          </p>
          <div className="guidance-callout">
            <span>
              <strong>Evaluator / Demo Step:</strong> If you are testing the system, sign out and log in with a <strong>Clinical Staff / Doctor</strong> account (or click Demo Staff at login). Then go to <strong>Admit & Plan Stay</strong>, enter or select <strong>{user?.email}</strong> as the patient email, and generate a stay plan. When you log back in as this patient, your personalized recovery dashboard will be active!
            </span>
          </div>
        </div>

        {/* Hospital Support Card */}
        <div className="hospital-support-card">
          <h4 className="support-title">Need Immediate Medical Assistance?</h4>
          <p className="support-desc">
            If you are experiencing a medical emergency, dial 911 or visit the nearest hospital emergency department immediately.
          </p>
          <div className="support-contact">
            <Phone size={16} className="contact-icon" />
            <span>Hospital Central Reception: +1 (800) 555-CARE | Ext. 100</span>
          </div>
        </div>
      </div>
    );
  }

  // Real Inpatient Record Present (Admitted by Doctor)
  const input = patientRecord.inputFeatures;
  const stayDays = Number(patientRecord.predictedStayDays);
  const prolongedRisk = patientRecord.prolongedStayRiskPct || 0;
  const confInterval = patientRecord.confidenceInterval || { minDays: stayDays, maxDays: stayDays };
  const doctorName = patientRecord.doctorName || 'Attending Physician';

  const roadmap = patientRecord.recoveryRoadmap && patientRecord.recoveryRoadmap.length > 0
    ? patientRecord.recoveryRoadmap
    : [
        {
          phase: 'Intake & Clinical Stabilization',
          target_day: 'Days 1 - 2',
          title: 'Clinical Intake & Treatment Baseline',
          description: 'Admission vitals verified, initial therapy initiated, and baseline monitoring established.'
        },
        {
          phase: 'Therapeutic Response & Review',
          target_day: 'Mid-Stay',
          title: 'Therapeutic Evaluation & Ward Rounds',
          description: 'Care team rounds evaluate therapeutic response, lab biomarkers, and symptom improvement.'
        },
        {
          phase: 'Discharge Clearance & Preparation',
          target_day: '48h Prior to Discharge',
          title: 'Pre-Discharge Clearance',
          description: 'Pharmacy take-home medication reconciliation, family transport confirmation, and outpatient follow-up booking.'
        },
        {
          phase: 'Discharge Day & Outpatient Transition',
          target_day: 'Discharge Morning',
          title: 'Physician Handover & Home Release',
          description: 'Final morning vitals sign-off, delivery of discharge packet, and formal transition to outpatient primary care.'
        }
      ];

  let dischargeDateStr = 'Pending evaluation';
  let followUpDateStr = 'Within 7 days of discharge';
  if (input.dateOfAdmission) {
    const d = new Date(input.dateOfAdmission);
    d.setDate(d.getDate() + Math.round(stayDays));
    dischargeDateStr = d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    const fu = new Date(d);
    fu.setDate(fu.getDate() + 7);
    followUpDateStr = fu.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Condition-specific discharge questions
  const conditionQuestions = {
    Asthma: [
      'What should my daily peak flow meter reading be before I use my rescue inhaler?',
      'How many days should I continue my oral steroid taper after returning home?',
      'What specific environmental triggers should I strictly avoid at home?'
    ],
    Diabetes: [
      'What blood glucose threshold requires an immediate call to the on-call physician?',
      'How should I adjust my insulin dose if my appetite is reduced during recovery?',
      'When should I schedule my next HbA1c lab evaluation?'
    ],
    Cancer: [
      'What body temperature reading indicates neutropenic fever requiring immediate emergency care?',
      'Who is my designated 24/7 oncology triage nurse contact?',
      'When is my next scheduled chemotherapy or radiation session?'
    ],
    Hypertension: [
      'What target home blood pressure reading should I aim for each morning?',
      'What should I do if I feel dizzy when standing up from bed or a chair?',
      'How frequently should I record readings in my blood pressure diary?'
    ],
    Arthritis: [
      'What daily walking distance or mobility exercises should I complete at home?',
      'How should I manage surgical site or joint swelling during recovery?',
      'When does my outpatient physical therapy program begin?'
    ],
    Obesity: [
      'What dietary consistency stages should I follow during the first two weeks?',
      'What are the warning signs of deep vein thrombosis (DVT) to watch for?',
      'When can I safely resume light physical activity and driving?'
    ]
  };

  const questions = conditionQuestions[input.medicalCondition] || [
    'What medications should I take at home and what are their common side effects?',
    'What specific warning signs or symptoms should prompt me to contact the hospital?',
    'When is my recommended outpatient follow-up consultation?'
  ];

  return (
    <div className="patient-portal-page">
      {/* Welcome Banner */}
      <section className="portal-header-card">
        <div className="portal-header-left">
          <div className="patient-avatar-box">
            <User size={32} />
          </div>
          <div>
            <span className="portal-badge">Active Inpatient Stay Plan</span>
            <h1 className="portal-title">Welcome, {patientRecord.patientName || user?.name}</h1>
            <p className="portal-desc">
              Attending Physician: <strong>{doctorName}</strong> | Diagnosis: <strong>{input.medicalCondition}</strong>
            </p>
          </div>
        </div>
        <div className="patient-meta-pill">
          <span className="meta-label">Admission Category:</span>
          <span className="meta-val">{input.admissionType} ({input.medicalCondition})</span>
        </div>
      </section>

      {/* Main Stay Metrics */}
      <div className="portal-grid">
        {/* Left Column: Stay Timeline & Care Plan */}
        <div className="portal-col-main">
          <div className="stay-summary-card">
            <div className="stay-summary-header">
              <h2 className="card-title">Inpatient Stay Timeline & Target Discharge</h2>
              <span className="active-badge">Verified Admission</span>
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
                <span className="hl-note">
                  80% CI: {confInterval.minDays.toFixed(1)} – {confInterval.maxDays.toFixed(1)} days
                </span>
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
                <span className="spec-label">Insurance Payer:</span>
                <span className="spec-val">{input.insuranceProvider}</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Prolonged Stay Risk:</span>
                <span className="spec-val">{prolongedRisk}% ({patientRecord.riskLevel || 'Standard'})</span>
              </div>
              <div className="spec-item">
                <span className="spec-label">Recommended Outpatient Visit:</span>
                <span className="spec-val">{followUpDateStr}</span>
              </div>
            </div>
          </div>

          {/* Recovery Milestones Stepper (Dynamic from Real ML Roadmap) */}
          <div className="milestones-card">
            <div className="card-top-header">
              <div>
                <h3 className="card-title">Your Personalized Recovery Roadmap</h3>
                <p className="card-subtitle">AI-calculated care phases tailored to {input.medicalCondition}</p>
              </div>
              <span className="roadmap-phase-badge">Phase 2 Active</span>
            </div>

            <div className="milestone-steps">
              {roadmap.map((step, idx) => (
                <div
                  key={idx}
                  className={`step-item ${idx === 0 ? 'step-completed' : idx === 1 ? 'step-current' : 'step-upcoming'}`}
                >
                  <div className="step-marker">
                    {idx === 0 ? '✓' : idx + 1}
                  </div>
                  <div className="step-content">
                    <div className="step-header-row">
                      <span className="step-title">{step.title}</span>
                      <span className="step-timing-pill">{step.target_day}</span>
                    </div>
                    <p className="step-desc">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Take-Home Medication Reconciliation & Schedule */}
          <MedicationSchedule condition={input.medicalCondition} />

          {/* Emergency Red-Flag Warning Signs & Clinical Triage */}
          <RedFlagAlerts condition={input.medicalCondition} />

          {/* Pre-Discharge Questions to Ask Doctor */}
          <div className="questions-card">
            <div className="questions-header">
              <HelpCircle size={18} className="questions-icon" />
              <h3 className="card-title">Recommended Questions for Your Care Team</h3>
            </div>
            <p className="card-subtitle">
              Prior to returning home, review these {input.medicalCondition}-specific recovery questions with Dr. {doctorName}:
            </p>
            <ul className="questions-list">
              {questions.map((q, idx) => (
                <li key={idx} className="question-item">
                  <span className="q-number">Q{idx + 1}</span>
                  <span className="q-text">{q}</span>
                </li>
              ))}
            </ul>
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
              Your inpatient care team is on duty 24/7. Use your bedside call button or contact nursing reception.
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
