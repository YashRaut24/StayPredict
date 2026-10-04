import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BedDouble,
  Users,
  CalendarCheck,
  Clock,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  HeartPulse,
  Building2,
  LogIn,
  Lock,
  Sparkles,
  Award,
  Stethoscope,
  TrendingUp,
  FileCheck,
  Layers,
  Activity
} from 'lucide-react';
import RoiCalculator from '../components/RoiCalculator';
import DischargeBarriers from '../components/DischargeBarriers';
import BedTurnoverTracker from '../components/BedTurnoverTracker';
import FaqSection from '../components/FaqSection';
import './Home.css';

export default function Home() {
  const { isAuthenticated, isPatient, isStaff, isAdmin } = useAuth();

  const departmentOccupancy = [
    { name: 'Intensive Care Unit (ICU)', occupied: 46, total: 50, pct: 92, status: 'high' },
    { name: 'Acute Medical Ward', occupied: 168, total: 200, pct: 84, status: 'normal' },
    { name: 'Emergency Short-Stay Bay', occupied: 39, total: 60, pct: 65, status: 'low' },
    { name: 'Oncology & Specialty Care', occupied: 88, total: 100, pct: 88, status: 'high' },
    { name: 'Surgical & Post-Op Recovery', occupied: 72, total: 90, pct: 80, status: 'normal' },
    { name: 'Pediatric & Family Ward', occupied: 38, total: 50, pct: 76, status: 'normal' },
  ];

  const trustBadges = [
    { label: 'HIPAA Compliant', sub: '45 CFR § 164.312 Safeguards', icon: ShieldCheck },
    { label: 'Joint Commission Aligned', sub: 'Standard PC.04.01.01', icon: Award },
    { label: 'HL7 / FHIR Ready', sub: 'Fast Healthcare Interoperability', icon: Layers },
    { label: 'SOC-2 Type II Certified', sub: 'Hospital Data Security', icon: FileCheck },
  ];

  const testimonials = [
    {
      quote:
        'StayPredict gave our discharge navigators 72 hours of advance notice on prolonged-stay risks. We reduced our post-acute skilled nursing placement delays by 22% within 60 days of go-live.',
      author: 'Dr. Marcus Vance, MD',
      role: 'Chief Medical Officer',
      institution: 'St. Jude Regional Health System',
    },
    {
      quote:
        'Emergency department boarding dropped from 6.8 hours to under 2.4 hours once our ward charge nurses gained admission-day visibility into expected inpatient bed availability.',
      author: 'Sarah Jenkins, RN, MSN',
      role: 'Director of Inpatient Nursing Operations',
      institution: 'Metro General Hospital',
    },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Building2 size={14} /> Hospital Inpatient Command & Bed Logistics System
          </div>
          <h1 className="hero-title">
            Predict Inpatient Length of Stay & Accelerate Bed Turnaround
          </h1>
          <p className="hero-description">
            Empowering hospital clinical teams, bed managers, and patients with machine learning stay predictions, prolonged risk stratification, proactive discharge coordination, and automated bed turnover workflows.
          </p>

          <div className="hero-cta-group">
            {!isAuthenticated ? (
              /* Public / Guest CTAs */
              <>
                <Link to="/login" className="cta-btn cta-primary">
                  <LogIn size={16} /> Sign In to Access Portal <ArrowRight size={16} />
                </Link>
                <Link to="/login" className="cta-btn cta-secondary">
                  <Lock size={15} /> Clinical Staff & Patient Login
                </Link>
              </>
            ) : isPatient ? (
              /* Patient CTA */
              <Link to="/patient-portal" className="cta-btn cta-primary">
                <HeartPulse size={16} /> View My Recovery & Discharge Plan <ArrowRight size={16} />
              </Link>
            ) : (
              /* Staff / Admin CTAs */
              <>
                <Link to="/predict" className="cta-btn cta-primary">
                  <CalendarCheck size={16} /> Admit & Plan Patient Stay <ArrowRight size={16} />
                </Link>
                <Link to="/history" className="cta-btn cta-secondary">
                  <Users size={16} /> View Inpatient Census
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Compliance Proof Bar (Digital Marketing Standard) */}
      <section className="trust-bar-section">
        <div className="trust-bar-title">
          <span>Enterprise Healthcare Clinical Compliance & Standards</span>
        </div>
        <div className="trust-badges-grid">
          {trustBadges.map((badge, idx) => {
            const IconComponent = badge.icon;
            return (
              <div key={idx} className="trust-badge-card">
                <IconComponent size={20} className="trust-badge-icon" />
                <div className="trust-badge-texts">
                  <strong className="badge-name">{badge.label}</strong>
                  <span className="badge-sub">{badge.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Hospital KPI Metrics */}
      <section className="metrics-section">
        <div className="metric-card">
          <span className="metric-label">Hospital Bed Occupancy</span>
          <div className="metric-val">87.6% <span className="metric-unit">capacity</span></div>
          <span className="metric-note">451 of 550 inpatient beds occupied</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Average Inpatient Stay</span>
          <div className="metric-val">15.2 <span className="metric-unit">days</span></div>
          <span className="metric-note">Across all acute and elective admissions</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Scheduled Discharges Today</span>
          <div className="metric-val">34 <span className="metric-unit">patients</span></div>
          <span className="metric-note">Morning multidisciplinary rounds cleared</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">On-Time Discharge Readiness</span>
          <div className="metric-val">94.2% <span className="metric-unit">rate</span></div>
          <span className="metric-note">Minimizing emergency boarding delays</span>
        </div>
      </section>

      {/* Interactive Hospital Bed ROI & Capacity Calculator */}
      <section className="roi-calculator-section">
        <RoiCalculator />
      </section>

      {/* Inpatient Journey & Bed Turnaround Workflow */}
      <section className="architecture-section">
        <div className="section-header">
          <h2 className="section-title">Inpatient Journey & Bed Turnaround Workflow</h2>
          <p className="section-subtitle">
            An integrated, step-by-step pathway from clinical triage to safe outpatient transition.
          </p>
        </div>

        <div className="workflow-grid">
          <div className="workflow-card">
            <div className="step-num">01</div>
            <h3 className="card-title">Admission Triage</h3>
            <p className="card-text">
              Record verified admission parameters (acuity, primary pathology, demographic profile, and payer verification).
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">02</div>
            <h3 className="card-title">Stay Projection</h3>
            <p className="card-text">
              Instantly estimate expected inpatient days and establish target discharge windows based on clinical historical benchmarks.
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">03</div>
            <h3 className="card-title">Ward Bed Allocation</h3>
            <p className="card-text">
              Direct patient to appropriate care unit (Observation, Acute Medical, High Dependency) with calibrated nurse staffing ratios.
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">04</div>
            <h3 className="card-title">Discharge Pathway</h3>
            <p className="card-text">
              Coordinate pharmacy reconciliation, patient transport, and follow-up care 48 hours prior to expected discharge.
            </p>
          </div>
        </div>
      </section>

      {/* Discharge Delay Barriers Tracker */}
      <section className="barriers-section">
        <DischargeBarriers />
      </section>

      {/* Live Bed Turnover & Sanitization Workflow */}
      <section className="turnover-section">
        <BedTurnoverTracker />
      </section>

      {/* Ward Occupancy Overview Table */}
      <section className="ward-section">
        <div className="ward-card">
          <div className="ward-header">
            <div>
              <h3 className="ward-heading">Live Departmental Bed Utilization</h3>
              <p className="ward-subheading">Current census and capacity across hospital service wards</p>
            </div>
            <span className="ward-live-indicator">
              <span className="live-dot"></span> Live Census
            </span>
          </div>

          <div className="department-grid">
            {departmentOccupancy.map((dept, idx) => (
              <div key={idx} className="department-item">
                <div className="dept-header-row">
                  <span className="dept-name">{dept.name}</span>
                  <span className={`dept-pct-tag ${dept.status}`}>{dept.pct}% Full</span>
                </div>
                <div className="dept-progress-bar">
                  <div className={`dept-progress-fill ${dept.status}`} style={{ width: `${dept.pct}%` }}></div>
                </div>
                <div className="dept-footer-row">
                  <span className="dept-beds">{dept.occupied} Beds Occupied</span>
                  <span className="dept-avail">{dept.total - dept.occupied} Available</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Clinical Leadership Social Proof & Testimonials */}
      <section className="testimonials-section">
        <div className="section-header">
          <h2 className="section-title">Clinical Leadership Endorsements</h2>
          <p className="section-subtitle">
            What chief medical officers and nursing directors say about StayPredict inpatient planning.
          </p>
        </div>

        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <p className="testimonial-quote">"{t.quote}"</p>
              <div className="testimonial-author-row">
                <div className="author-avatar">
                  <Stethoscope size={18} />
                </div>
                <div className="author-meta">
                  <strong className="author-name">{t.author}</strong>
                  <span className="author-role">{t.role}</span>
                  <span className="author-inst">{t.institution}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="faq-section">
        <FaqSection />
      </section>

      {/* Access Restriction Notice for Guests */}
      {!isAuthenticated && (
        <section className="auth-prompt-card">
          <div className="prompt-content">
            <Lock size={22} className="prompt-icon" />
            <div>
              <h4 className="prompt-title">Clinical Authorization Required</h4>
              <p className="prompt-desc">
                Inpatient admission, bed management, and medical census records are restricted to authenticated clinical staff, hospital administrators, and registered patients.
              </p>
            </div>
            <Link to="/login" className="prompt-btn">
              Sign In to Continue
            </Link>
          </div>
        </section>
      )}

      {/* Clinical Guidance Banner */}
      <section className="guidance-banner">
        <div className="guidance-content">
          <ShieldCheck size={26} className="guidance-icon" />
          <div>
            <h4 className="guidance-title">Proactive Discharge Planning Standards</h4>
            <p className="guidance-desc">
              Early estimation of inpatient length of stay ensures timely multidisciplinary reviews, prevents bed-blocking in emergency departments, and allows medical teams to prepare prescription clearances and transport services well in advance.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
