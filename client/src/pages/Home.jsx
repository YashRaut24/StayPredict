import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Cpu, Database, ArrowRight, CheckCircle2, BarChart3, Clock, AlertTriangle } from 'lucide-react';
import { getSystemHealth } from '../services/api';
import './Home.css';

export default function Home() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function loadHealth() {
      const data = await getSystemHealth();
      setHealth(data);
    }
    loadHealth();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <ShieldCheck size={14} /> Production-Grade ML Healthcare Pipeline
          </div>
          <h1 className="hero-title">
            Hospital Length of Stay (LOS) Predictive Engine
          </h1>
          <p className="hero-description">
            Empower clinical administrators and triage teams with accurate, leakage-free bed occupancy projections at the exact moment of patient admission.
          </p>
          <div className="hero-cta-group">
            <Link to="/predict" className="cta-btn cta-primary">
              Launch LOS Predictor <ArrowRight size={16} />
            </Link>
            <Link to="/history" className="cta-btn cta-secondary">
              View Audit History
            </Link>
          </div>
        </div>
      </section>

      {/* Metrics Banner */}
      <section className="metrics-section">
        <div className="metric-card">
          <span className="metric-label">Model Test MAE</span>
          <div className="metric-val">7.47 <span className="metric-unit">days</span></div>
          <span className="metric-note">Evaluated on 10,994 unseen admissions</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Dataset Volume</span>
          <div className="metric-val">54,966 <span className="metric-unit">records</span></div>
          <span className="metric-note">Cleaned and deduplicated records</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Encoded Feature Space</span>
          <div className="metric-val">29 <span className="metric-unit">features</span></div>
          <span className="metric-note">StandardScaler + OneHotEncoder</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Model Architecture</span>
          <div className="metric-val">Random Forest</div>
          <span className="metric-note">200 Estimators, Max Depth 12</span>
        </div>
      </section>

      {/* Architectural Guarantee Section */}
      <section className="architecture-section">
        <div className="section-header">
          <h2 className="section-title">Clinical Machine Learning Architecture</h2>
          <p className="section-subtitle">
            Engineered with strict separation of pre-admission clinical inputs to eliminate post-admission data leakage.
          </p>
        </div>

        <div className="workflow-grid">
          <div className="workflow-card">
            <div className="step-num">01</div>
            <h3 className="card-title">Pre-Admission Intake</h3>
            <p className="card-text">
              Captures only 7 verified admission-time features: Age, Gender, Blood Type, Primary Diagnosis, Admission Type, Insurance, and Admission Date.
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">02</div>
            <h3 className="card-title">Temporal Engineering</h3>
            <p className="card-text">
              Transforms dates into Admission Year, Month, Day, and Day-of-Week to model operational admission surges and seasonal variances.
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">03</div>
            <h3 className="card-title">FastAPI Microservice</h3>
            <p className="card-text">
              Loads serialized Scikit-Learn pipeline artifacts in memory and executes low-latency vector transformations with Pydantic validation.
            </p>
          </div>

          <div className="workflow-card">
            <div className="step-num">04</div>
            <h3 className="card-title">Express & MongoDB</h3>
            <p className="card-text">
              Gateway routes predictions, validates payloads, and logs every inference with timestamps and model metadata into MongoDB for clinical auditing.
            </p>
          </div>
        </div>
      </section>

      {/* Zero Leakage Banner */}
      <section className="leakage-banner">
        <div className="leakage-content">
          <div className="leakage-icon">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="leakage-title">Strict Zero-Data-Leakage Guarantee</h4>
            <p className="leakage-desc">
              Features such as <code>Discharge Date</code>, <code>Billing Amount</code>, <code>Medications</code>, and <code>Test Results</code> are strictly eliminated from training because they are generated <em>after</em> or <em>during</em> hospitalization. Predicting stay duration using future data produces misleading models. StayPredict models only pre-admission reality.
            </p>
          </div>
        </div>
      </section>

      {/* Live System Health Section */}
      <section className="health-section">
        <div className="health-card">
          <div className="health-header">
            <h3 className="health-title">System Infrastructure Status</h3>
            <span className="health-timestamp">
              {health?.timestamp ? new Date(health.timestamp).toLocaleTimeString() : 'Live'}
            </span>
          </div>

          <div className="health-grid">
            <div className="health-item">
              <span className="health-name">Express API Gateway</span>
              <span className={`health-status-tag ${health?.backend ? 'healthy' : 'degraded'}`}>
                {health?.backend || 'Online (Port 5000)'}
              </span>
            </div>

            <div className="health-item">
              <span className="health-name">FastAPI Inference Service</span>
              <span className={`health-status-tag ${health?.mlService?.status === 'healthy' ? 'healthy' : 'degraded'}`}>
                {health?.mlService?.status === 'healthy' ? 'Online (Port 8000)' : 'Unreachable'}
              </span>
            </div>

            <div className="health-item">
              <span className="health-name">MongoDB Audit Store</span>
              <span className={`health-status-tag ${health?.database === 'connected' ? 'healthy' : 'warning'}`}>
                {health?.database === 'connected' ? 'Connected (Port 27017)' : 'Disconnected (Demo Mode)'}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
