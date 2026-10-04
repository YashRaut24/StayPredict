import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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
              <Route path="/" element={<Home />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/history" element={<History />} />
              <Route path="/analytics" element={<WardAnalytics />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/patient-portal" element={<PatientPortal />} />
              <Route path="/admin" element={<AdminPanel />} />
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
