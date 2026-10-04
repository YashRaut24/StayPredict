import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Activity, Database, Server, Cpu } from 'lucide-react';
import { getSystemHealth } from '../services/api';
import './Navbar.css';

export default function Navbar() {
  const [health, setHealth] = useState(null);

  useEffect(() => {
    async function checkHealth() {
      const data = await getSystemHealth();
      setHealth(data);
    }
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const isFastApiOk = health?.mlService?.status === 'healthy';
  const isExpressOk = health?.status === 'healthy';
  const isMongoOk = health?.database === 'connected';

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-logo">
            <div className="brand-icon-box">
              <Activity size={20} className="brand-icon" />
            </div>
            <div className="brand-text">
              <span className="brand-title">StayPredict</span>
              <span className="brand-subtitle">Clinical LOS Decision Support</span>
            </div>
          </NavLink>
        </div>

        <nav className="navbar-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Overview
          </NavLink>
          <NavLink
            to="/predict"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Predict LOS
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Audit History
          </NavLink>
          <NavLink
            to="/model-info"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Model Specs
          </NavLink>
        </nav>

        <div className="navbar-status">
          <div className="status-item" title={`FastAPI ML Service: ${isFastApiOk ? 'Online' : 'Offline'}`}>
            <Cpu size={14} />
            <span className="status-name">ML Engine</span>
            <span className={`status-indicator ${isFastApiOk ? 'online' : 'offline'}`}></span>
          </div>

          <div className="status-item" title={`Express Gateway: ${isExpressOk ? 'Online' : 'Offline'}`}>
            <Server size={14} />
            <span className="status-name">API</span>
            <span className={`status-indicator ${isExpressOk ? 'online' : 'offline'}`}></span>
          </div>

          <div className="status-item" title={`MongoDB History Store: ${isMongoOk ? 'Connected' : 'Disconnected'}`}>
            <Database size={14} />
            <span className="status-name">Database</span>
            <span className={`status-indicator ${isMongoOk ? 'online' : 'warning'}`}></span>
          </div>
        </div>
      </div>
    </header>
  );
}
