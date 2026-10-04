import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Predict from './pages/Predict';
import History from './pages/History';
import WardAnalytics from './pages/WardAnalytics';
import Auth from './pages/Auth';
import PatientPortal from './pages/PatientPortal';
import AdminPanel from './pages/AdminPanel';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="app-main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Auth />} />

              {/* Protected Clinical Staff & Admin Routes */}
              <Route
                path="/predict"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <Predict />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin']}>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute allowedRoles={['staff', 'admin', 'patient']}>
                    <WardAnalytics />
                  </ProtectedRoute>
                }
              />

              {/* Protected Patient Route */}
              <Route
                path="/patient-portal"
                element={
                  <ProtectedRoute allowedRoles={['patient', 'staff', 'admin']}>
                    <PatientPortal />
                  </ProtectedRoute>
                }
              />

              {/* Protected Hospital Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <AdminPanel />
                  </ProtectedRoute>
                }
              />

              {/* Fallbacks */}
              <Route path="/model-info" element={<Navigate to="/analytics" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
