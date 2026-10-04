import React, { useState, useEffect } from 'react';
import { getPredictionHistory } from '../services/api';
import { RefreshCw, Search, Filter, Calendar, Users, AlertCircle, BedDouble } from 'lucide-react';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterCondition, setFilterCondition] = useState('All');
  const [filterAdmission, setFilterAdmission] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchHistory = async () => {
    setIsLoading(true);
    setError('');
    try {
      const res = await getPredictionHistory();
      setHistory(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to retrieve inpatient census records.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filter logic
  const filteredHistory = history.filter((item) => {
    const input = item.inputFeatures || {};
    const matchesCondition =
      filterCondition === 'All' || input.medicalCondition === filterCondition;
    const matchesAdmission =
      filterAdmission === 'All' || input.admissionType === filterAdmission;
    const matchesSearch =
      searchQuery === '' ||
      input.medicalCondition?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      input.insuranceProvider?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      input.gender?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCondition && matchesAdmission && matchesSearch;
  });

  return (
    <div className="history-page">
      <div className="history-header">
        <div>
          <h1 className="history-title">Inpatient Census & Bed Directory</h1>
          <p className="history-subtitle">
            Central registry of admitted patients, projected hospitalization timelines, and scheduled discharge targets.
          </p>
        </div>
        <button
          type="button"
          className="btn-refresh"
          onClick={fetchHistory}
          disabled={isLoading}
        >
          <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
          <span>Refresh Census</span>
        </button>
      </div>

      {error && (
        <div className="history-alert-error">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="history-toolbar">
        <div className="toolbar-search">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search by diagnosis, insurance, demographic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="toolbar-filters">
          <div className="filter-group">
            <label className="filter-label">Diagnosis:</label>
            <select
              className="filter-select"
              value={filterCondition}
              onChange={(e) => setFilterCondition(e.target.value)}
            >
              <option value="All">All Conditions</option>
              <option value="Diabetes">Diabetes</option>
              <option value="Hypertension">Hypertension</option>
              <option value="Asthma">Asthma</option>
              <option value="Arthritis">Arthritis</option>
              <option value="Cancer">Cancer / Oncology</option>
              <option value="Obesity">Obesity</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Acuity:</label>
            <select
              className="filter-select"
              value={filterAdmission}
              onChange={(e) => setFilterAdmission(e.target.value)}
            >
              <option value="All">All Urgency Levels</option>
              <option value="Emergency">Emergency</option>
              <option value="Urgent">Urgent</option>
              <option value="Elective">Elective</option>
            </select>
          </div>
        </div>
      </div>

      {/* Census Table */}
      <div className="history-table-card">
        {isLoading ? (
          <div className="history-loading">
            <RefreshCw size={24} className="spinning" />
            <p>Loading inpatient directory records...</p>
          </div>
        ) : filteredHistory.length === 0 ? (
          <div className="history-empty">
            <Users size={36} className="empty-icon" />
            <h3>No Patient Records Found</h3>
            <p>
              {history.length === 0
                ? 'No inpatient admissions have been recorded yet. Navigate to "Admit & Plan Stay" to admit your first patient.'
                : 'No patients match your selected filter criteria. Try adjusting your search query or filters.'}
            </p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Admit Time</th>
                  <th>Patient Profile</th>
                  <th>Clinical Diagnosis</th>
                  <th>Acuity & Payer</th>
                  <th>Admission Date</th>
                  <th>Expected Stay</th>
                  <th>Target Discharge</th>
                  <th>Bed Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item) => {
                  const input = item.inputFeatures || {};
                  const days = Number(item.predictedStayDays);

                  let dischargeStr = '—';
                  if (input.dateOfAdmission) {
                    const d = new Date(input.dateOfAdmission);
                    d.setDate(d.getDate() + Math.round(days));
                    dischargeStr = d.toISOString().split('T')[0];
                  }

                  let badgeClass = 'badge-normal';
                  let bedStatus = 'Bed Assigned';
                  if (days <= 7) {
                    badgeClass = 'badge-low';
                    bedStatus = 'Short-Stay Unit';
                  } else if (days > 15) {
                    badgeClass = 'badge-high';
                    bedStatus = 'Specialty Inpatient';
                  }

                  return (
                    <tr key={item._id}>
                      <td className="cell-timestamp">
                        {item.createdAt ? new Date(item.createdAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'N/A'}
                      </td>
                      <td>
                        <div className="patient-profile-cell">
                          <strong className="patient-name-text">{item.patientName || 'Inpatient Record'}</strong>
                          {item.patientEmail && (
                            <span className="patient-email-text">{item.patientEmail}</span>
                          )}
                          <span className="patient-blood">
                            {input.age}y / {input.gender} • {input.bloodType}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="cell-condition">{input.medicalCondition}</span>
                      </td>
                      <td>
                        <span className="cell-admission-type">{input.admissionType}</span>
                        <span className="cell-insurance">{input.insuranceProvider}</span>
                      </td>
                      <td className="cell-date">
                        {input.dateOfAdmission || '—'}
                      </td>
                      <td>
                        <span className={`stay-days-badge ${badgeClass}`}>
                          {days.toFixed(1)} days
                        </span>
                      </td>
                      <td className="cell-discharge">
                        {dischargeStr}
                      </td>
                      <td>
                        <span className="bed-status-pill">
                          <BedDouble size={12} /> {bedStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
