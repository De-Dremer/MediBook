import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Patient Pages
import SimpleDashboard from './pages/patient/SimpleDashboard';
import FindDoctors from './pages/patient/FindDoctors';
import MyAppointments from './pages/patient/MyAppointments';
import BookAppointment from './pages/patient/BookAppointment';
import DoctorProfile from './pages/patient/DoctorProfile';
import PatientProfile from './pages/patient/Profile';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />

              {/* ✅ PUBLIC ROUTE - No protection needed for browsing doctors */}
              <Route path="/patient/find-doctors" element={<FindDoctors />} />

              {/* ✅ PROTECTED PATIENT ROUTES */}
              <Route path="/dashboard" element={
                <ProtectedRoute requiredRole="patient">
                  <SimpleDashboard />
                </ProtectedRoute>
              } />

              <Route path="/patient/appointments" element={
                <ProtectedRoute requiredRole="patient">
                  <MyAppointments />
                </ProtectedRoute>
              } />

              <Route path="/patient/book-appointment/:doctorId?" element={
                <ProtectedRoute requiredRole="patient">
                  <BookAppointment />
                </ProtectedRoute>
              } />

              <Route path="/patient/doctor/:doctorId" element={
                <ProtectedRoute requiredRole="patient">
                  <DoctorProfile />
                </ProtectedRoute>
              } />

              <Route path="/patient/profile" element={
                <ProtectedRoute requiredRole="patient">
                  <PatientProfile />
                </ProtectedRoute>
              } />

              {/* ✅ PROTECTED DOCTOR ROUTES */}
              <Route path="/doctor/dashboard" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorDashboard />
                </ProtectedRoute>
              } />

              <Route path="/doctor/appointments" element={
                <ProtectedRoute requiredRole="doctor">
                  <DoctorAppointments />
                </ProtectedRoute>
              } />
            </Route>
          </Routes>

          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#374151',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#f0fdf4',
                  color: '#166534',
                  border: '1px solid #bbf7d0',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#fef2f2',
                  color: '#991b1b',
                  border: '1px solid #fecaca',
                },
              },
            }}
          />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
