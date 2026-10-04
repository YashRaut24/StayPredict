import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-info">
          <p className="footer-text">
            <strong>StayPredict</strong> — Machine Learning Hospital Length of Stay (LOS) Clinical Decision Support System.
          </p>
          <p className="footer-subtext">
            Built with Scikit-Learn Random Forest Regressor (MAE 7.47d), FastAPI Microservice, Node/Express Gateway & React.
          </p>
        </div>
        <div className="footer-meta">
          <span className="footer-tag">Model Version: v1.0.0</span>
          <span className="footer-tag">Pipeline: Leakage-Free Pre-Admission</span>
        </div>
      </div>
    </footer>
  );
}
