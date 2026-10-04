import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Building2, Bed, Users, BarChart3, PlusCircle, LogIn, LogOut, ShieldCheck, User, Stethoscope } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, role, isAdmin, isStaff, isPatient, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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

        {/* Dynamic Navigation Links based on role */}
        <nav className="navbar-links">
          {/* Patients have dedicated recovery links */}
          {isPatient ? (
            <>
              <NavLink
                to="/patient-portal"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <User size={14} className="nav-inline-icon" /> My Stay Plan
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <BarChart3 size={14} className="nav-inline-icon" /> Care Pathways
              </NavLink>
            </>
          ) : (
            /* Staff, Admin, and Guests */
            <>
              <NavLink
                to="/"
                end
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Dashboard
              </NavLink>

              {(isStaff || !isAuthenticated) && (
                <NavLink
                  to="/predict"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <PlusCircle size={14} className="nav-inline-icon" /> Admit & Plan Stay
                </NavLink>
              )}

              {(isStaff || !isAuthenticated) && (
                <NavLink
                  to="/history"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <Users size={14} className="nav-inline-icon" /> Patient Census
                </NavLink>
              )}

              <NavLink
                to="/analytics"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <BarChart3 size={14} className="nav-inline-icon" /> Ward Analytics
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/admin"
                  className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                >
                  <ShieldCheck size={14} className="nav-inline-icon" /> Admin Controls
                </NavLink>
              )}
            </>
          )}
        </nav>

        {/* User Role Badge & Auth Actions */}
        <div className="navbar-auth-actions">
          {isAuthenticated ? (
            <div className="user-profile-wrap">
              <div className="user-info-box">
                <span className="user-name">{user?.name}</span>
                <span className={`role-pill role-pill-${role}`}>
                  {role === 'admin' ? 'Hospital Admin' : role === 'staff' ? 'Clinical Staff' : 'Patient'}
                </span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                title="Sign out of hospital system"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-signin">
              <LogIn size={14} /> Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
