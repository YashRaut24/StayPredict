import React from 'react';
import { Link } from 'react-router-dom';
import { BedDouble, Users, CalendarCheck, Clock, ArrowRight, CheckCircle2, ShieldCheck, HeartPulse, Building2, AlertCircle } from 'lucide-react';
import './Home.css';

export default function Home() {
  const departmentOccupancy = [
    { name: 'Intensive Care Unit (ICU)', occupied: 46, total: 50, pct: 92, status: 'high' },
    { name: 'Acute Medical Ward', occupied: 168, total: 200, pct: 84, status: 'normal' },
    { name: 'Emergency Short-Stay Bay', occupied: 39, total: 60, pct: 65, status: 'low' },
    { name: 'Oncology & Specialty Care', occupied: 88, total: 100, pct: 88, status: 'high' },
    { name: 'Surgical & Post-Op Recovery', occupied: 72, total: 90, pct: 80, status: 'normal' },
    { name: 'Pediatric & Family Ward', occupied: 38, total: 50, pct: 76, status: 'normal' },
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Building2 size={14} /> Hospital Inpatient Command System
          </div>
          <h1 className="hero-title">
            Inpatient Length of Stay & Bed Resource Planning
          </h1>
          <p className="hero-description">
            Streamlining patient admission intake, bed allocation timelines, and proactive discharge coordination from the exact moment of clinical admission.
          </p>
          <div className="hero-cta-group">
            <Link to="/predict" className="cta-btn cta-primary">
              <CalendarCheck size={16} /> Admit & Plan Patient Stay <ArrowRight size={16} />
            </Link>
            <Link to="/history" className="cta-btn cta-secondary">
              <Users size={16} /> View Inpatient Census
            </Link>
          </div>
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

      {/* Hospital Inpatient Workflow */}
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
