// Main App component

import { useState } from 'react';
import { useAuth } from './hooks';
import { LoginPage, RegisterPage } from './pages/auth';
import { Dashboard } from './pages/dashboard';
import { PatientList } from './pages/patients';
import { DoctorList } from './pages/doctors';
import { AppointmentList } from './pages/appointments';
import { Layout } from './components/layout';

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<string>('dashboard');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-base flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-bg-base">
        <div className="bg-bg-panel border-b border-border-subtle">
          <div className="max-w-5xl mx-auto px-8 py-4">
            <h1 className="font-semibold text-text-primary">HMS — Hospital Management System</h1>
          </div>
        </div>
        <div className="flex items-center justify-center p-4">
          {authMode === 'login' ? (
            <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
          ) : (
            <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
          )}
        </div>
      </div>
    );
  }

  return (
    <Layout activeView={view} onViewChange={setView}>
      {view === 'dashboard' && <Dashboard onRefresh={() => {}} />}
      {view === 'patients' && <PatientList onRefresh={() => {}} />}
      {view === 'doctors' && <DoctorList onRefresh={() => {}} />}
      {view === 'appointments' && <AppointmentList onRefresh={() => {}} />}
    </Layout>
  );
}
