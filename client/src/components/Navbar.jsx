import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, Bed, Users, BarChart3, PlusCircle, CheckCircle2 } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-logo">
            <div className="brand-icon-box">
              <Building2 size={20} className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">StayPredict Health</span>
              <span className="brand-subtitle">Inpatient & Bed Flow Intelligence</span>
            </div>
          </NavLink>
        </div>

        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <PlusCircle size={14} className="nav-inline-icon" /> Admit & Plan Stay
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <Users size={14} className="nav-inline-icon" /> Patient Census
          </NavLink>
          <NavLink
            to="/analytics"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            <BarChart3 size={14} className="nav-inline-icon" /> Ward Analytics
          </NavLink>
        </nav>

        <div className="navbar-status">
          <div className="hospital-status-pill">
            <span className="status-dot-pulse"></span>
            <span className="hospital-dept">Inpatient Triage: Active</span>
          </div>
          <div className="hospital-user-tag">
            <span className="user-role">Admissions Desk</span>
          </div>
        </div>
      </div>
    </header>
  );
}
