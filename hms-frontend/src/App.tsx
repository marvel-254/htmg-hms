import { useState } from 'react';
import { useAuth } from './hooks';
import { LoginPage, RegisterPage } from './auth';
import { Dashboard } from './dashboard';
import { PatientList } from './patients';
import { DoctorList } from './doctors';
import { AppointmentList } from './appointments';
import { 
  Hospital, Users, Stethoscope, Calendar, SignOut, 
  House 
} from '@phosphor-icons/react';

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'dashboard' | 'patients' | 'doctors' | 'appointments'>('dashboard');

  const refresh = () => {
    window.location.reload();
  };

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
    return <AuthPages />;
  }

  // Role-based menu filter
  const filteredNav = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: House },
    { id: 'patients' as const, label: 'Patients', icon: Users },
    { id: 'doctors' as const, label: 'Doctors', icon: Stethoscope },
    { id: 'appointments' as const, label: 'Appointments', icon: Calendar },
  ].filter((item) => {
    if (user.role === 'admin') return true;
    if (user.role === 'receptionist') return ['dashboard', 'patients', 'doctors', 'appointments'].includes(item.id);
    if (user.role === 'doctor') return ['dashboard', 'appointments'].includes(item.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-bg-base flex">
      {/* Sidebar */}
      <aside className="bg-bg-panel border-r border-border-subtle w-64 min-h-screen flex flex-col">
        <div className="p-5 border-b border-border-subtle">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <Hospital className="w-5 h-5 text-white" weight="bold" />
            </div>
            <div>
              <h1 className="font-semibold text-text-primary text-sm">HMS</h1>
              <p className="text-xs text-text-muted">Hospital Management</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 flex-1">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                view === item.id
                  ? 'bg-brand/10 text-brand-accent'
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
              }`}
            >
              <item.icon className="w-4 h-4" weight={view === item.id ? 'bold' : 'regular'} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-border-subtle">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
              <span className="text-xs font-semibold text-brand-accent">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">{user.name}</p>
              <p className="text-xs text-text-muted capitalize">{user.role}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('htmg_token');
                window.location.reload();
              }}
              className="text-text-muted hover:text-error transition-colors p-1"
              title="Logout"
            >
              <SignOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {view === 'dashboard' && <Dashboard onRefresh={refresh} />}
          {view === 'patients' && <PatientList onRefresh={refresh} />}
          {view === 'doctors' && <DoctorList onRefresh={refresh} />}
          {view === 'appointments' && <AppointmentList onRefresh={refresh} />}
        </div>
      </main>
    </div>
  );
}

function AuthPages() {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  return (
    <div className="min-h-screen bg-bg-base">
      {/* Header */}
      <div className="bg-bg-panel border-b border-border-subtle">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
              <Hospital className="w-5 h-5 text-white" weight="bold" />
            </div>
            <div>
              <h1 className="font-semibold text-text-primary">HMS</h1>
              <p className="text-xs text-text-muted">Hospital Management System</p>
            </div>
          </div>
          <p className="text-sm text-text-tertiary">Integrated platform for hospital operations</p>
        </div>
      </div>

      <div className="flex items-center justify-center p-4">
        {authMode === 'login' ? (
          <>
            <LoginPage onSwitchToRegister={() => setAuthMode('register')} />
            <div className="hidden md:block w-1/2" />
          </>
        ) : (
          <>
            <div className="hidden md:block w-1/2" />
            <RegisterPage onSwitchToLogin={() => setAuthMode('login')} />
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-bg-panel border-t border-border-subtle py-4 mt-auto">
        <div className="max-w-5xl mx-auto px-8 text-center text-sm text-text-muted">
          HMS Prototype · Demo version · Patient data is stored temporarily
        </div>
      </footer>
    </div>
  );
}
