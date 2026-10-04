import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Building2, BedDouble, Users, Settings, Database, Activity, CheckCircle2 } from 'lucide-react';
import './AdminPanel.css';

export default function AdminPanel() {
  const { user } = useAuth();

  const [wards, setWards] = useState([
    { id: 1, name: 'General Acute Medical Ward', capacity: 200, occupied: 168, leadNurse: 'Nurse S. Thompson' },
    { id: 2, name: 'Intensive Care Unit (ICU)', capacity: 50, occupied: 46, leadNurse: 'Dr. M. Patel' },
    { id: 3, name: 'Surgical Inpatient Recovery', capacity: 90, occupied: 72, leadNurse: 'Nurse R. Gable' },
    { id: 4, name: 'Oncology Care Pavilion', capacity: 100, occupied: 88, leadNurse: 'Dr. L. Chen' },
    { id: 5, name: 'Emergency Short-Stay Bay', capacity: 60, occupied: 39, leadNurse: 'Nurse K. Adams' },
  ]);

  const [usersList, setUsersList] = useState([
    { id: 1, name: 'Dr. Robert Vance', email: 'admin@staypredict.health', role: 'admin', dept: 'Hospital Executive Office' },
    { id: 2, name: 'Nurse Sarah Jenkins', email: 'staff@staypredict.health', role: 'staff', dept: 'Emergency & Inpatient Triage' },
    { id: 3, name: 'Jane Doe', email: 'patient@staypredict.health', role: 'patient', dept: 'Inpatient Care' },
    { id: 4, name: 'Dr. John Watson', email: 'doctor.watson@hospital.org', role: 'staff', dept: 'Emergency & Triage' },
  ]);

  const [successMsg, setSuccessMsg] = useState('');

  const handleCapacityChange = (id, newCap) => {
    setWards((prev) =>
      prev.map((w) => (w.id === id ? { ...w, capacity: Number(newCap) } : w))
    );
    setSuccessMsg('Ward bed allocation updated successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const totalCapacity = wards.reduce((acc, w) => acc + w.capacity, 0);
  const totalOccupied = wards.reduce((acc, w) => acc + w.occupied, 0);
  const occupancyPct = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <div className="admin-panel-page">
      <div className="admin-header">
        <div>
          <span className="admin-badge">Hospital Management & Operations</span>
          <h1 className="admin-title">Central Administration Console</h1>
          <p className="admin-subtitle">
            Configure hospital-wide bed allocations, department service quotas, and staff access roles.
          </p>
        </div>
        <div className="admin-user-pill">
          <ShieldCheck size={16} />
          <span>Logged in as: {user?.name} (Administrator)</span>
        </div>
      </div>

      {successMsg && (
        <div className="admin-success-alert">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hospital Stats Cards */}
      <section className="admin-stats-grid">
        <div className="admin-stat-card">
          <span className="stat-label">Total Hospital Bed Capacity</span>
          <div className="stat-val">{totalCapacity} <span className="stat-unit">beds</span></div>
          <span className="stat-sub">Across 5 specialized clinical wards</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Current Occupancy Rate</span>
          <div className="stat-val">{occupancyPct}% <span className="stat-unit">full</span></div>
          <span className="stat-sub">{totalOccupied} of {totalCapacity} beds occupied</span>
        </div>
        <div className="admin-stat-card">
          <span className="stat-label">Available Emergency Beds</span>
          <div className="stat-val">{totalCapacity - totalOccupied} <span className="stat-unit">ready</span></div>
          <span className="stat-sub">Sanitized and staffed for intake</span>
        </div>
      </section>

      {/* Ward Capacity Management */}
      <section className="admin-card">
        <div className="admin-card-header">
          <BedDouble size={18} className="card-icon" />
          <h2 className="card-heading">Department Bed Allocation Controls</h2>
        </div>
        <p className="card-desc">
          Adjust bed quotas per department in response to community admission surges and staffing capacity.
        </p>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service Ward</th>
                <th>Supervising Lead</th>
                <th>Occupied</th>
                <th>Total Bed Capacity</th>
                <th>Utilization</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wards.map((ward) => {
                const pct = Math.round((ward.occupied / ward.capacity) * 100);
                return (
                  <tr key={ward.id}>
                    <td className="font-semibold">{ward.name}</td>
                    <td>{ward.leadNurse}</td>
                    <td>{ward.occupied} Beds</td>
                    <td>
                      <input
                        type="number"
                        min={ward.occupied}
                        max="500"
                        className="capacity-input"
                        value={ward.capacity}
                        onChange={(e) => handleCapacityChange(ward.id, e.target.value)}
                      />
                    </td>
                    <td>
                      <span className={`status-pill ${pct > 85 ? 'high' : 'normal'}`}>
                        {pct}% Full
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn-update-sm"
                        onClick={() => handleCapacityChange(ward.id, ward.capacity)}
                      >
                        Save
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Role Management Roster */}
      <section className="admin-card">
        <div className="admin-card-header">
          <Users size={18} className="card-icon" />
          <h2 className="card-heading">Active Clinical & Patient Access Roster</h2>
        </div>
        <p className="card-desc">
          Authenticated accounts with role-based permissions across StayPredict Health.
        </p>

        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email Address</th>
                <th>Assigned Role</th>
                <th>Department</th>
                <th>Access Level</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id}>
                  <td className="font-semibold">{u.name}</td>
                  <td className="font-mono">{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role}`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td>{u.dept}</td>
                  <td>
                    {u.role === 'admin'
                      ? 'Full System & Bed Management'
                      : u.role === 'staff'
                      ? 'Triage Intake & Census View'
                      : 'Personal Recovery Portal'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
