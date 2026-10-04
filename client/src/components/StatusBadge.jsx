import React from 'react';
import './StatusBadge.css';

export default function StatusBadge({ status, label }) {
  const isHealthy = status === 'healthy' || status === 'connected';
  const isWarning = status === 'degraded' || status === 'disconnected';

  const badgeClass = isHealthy
    ? 'status-badge-healthy'
    : isWarning
    ? 'status-badge-warning'
    : 'status-badge-error';

  return (
    <div className={`status-badge ${badgeClass}`}>
      <span className="status-dot"></span>
      <span className="status-label">{label}:</span>
      <span className="status-value">{status || 'checking'}</span>
    </div>
  );
}
