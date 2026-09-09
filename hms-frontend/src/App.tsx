import { useState } from 'react';
import { useAuth } from './hooks';
import { LoginPage, RegisterPage } from './auth';
import { Dashboard } from './dashboard';
import { PatientList } from './patients';
import { DoctorList } from './doctors';
import { AppointmentList } from './appointments';

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<'dashboard' | 'patients' | 'doctors' | 'appointments'>('dashboard');

  const refresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-gray-500">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPages />;
  }

  // 역할별 메뉴 필터
  const filteredNav = [
    { id: 'dashboard' as const, label: '대시보드', icon: DashboardIcon },
    { id: 'patients' as const, label: '환자 관리', icon: UsersIcon },
    { id: 'doctors' as const, label: '의사 관리', icon: StethoscopeIcon },
    { id: 'appointments' as const, label: '예약 관리', icon: CalendarIcon },
  ].filter((item) => {
    if (user.role === 'admin') return true;
    if (user.role === 'receptionist') return ['dashboard', 'patients', 'doctors', 'appointments'].includes(item.id);
    if (user.role === 'doctor') return ['dashboard', 'appointments'].includes(item.id);
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* 사이드바 */}
      <aside className="bg-white border-r border-gray-200 w-64 min-h-screen">
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">HMS</h1>
              <p className="text-xs text-gray-500">병원 관리 시스템</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {filteredNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                view === item.id
                  ? 'bg-primary text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-sm font-medium text-primary">{user.name.charAt(0)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500">{user.role}</p>
            </div>
            <button
              onClick={() => {
                localStorage.removeItem('htmg_token');
                window.location.reload();
              }}
              className="text-gray-400 hover:text-red-500 transition p-1"
              title="로그아웃"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <main className="flex-1 p-8">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* 로고 배너 */}
      <div className="bg-primary text-white py-4">
        <div className="max-w-5xl mx-auto px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-lg">HMS</h1>
              <p className="text-xs text-white/70">Hospital Management System</p>
            </div>
          </div>
          <p className="text-sm text-white/80">병원 운영 효율화를 위한 통합 관리 플랫폼</p>
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

      {/* 푸터 */}
      <footer className="bg-white border-t py-4">
        <div className="max-w-5xl mx-auto px-8 text-center text-sm text-gray-400">
          HMS Prototype · 데모용 버전 · 환자 데이터는 브라우저/서버에 임시 저장됩니다
        </div>
      </footer>
    </div>
  );
}

// 아이콘 컴포넌트
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  );
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  );
}

function StethoscopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}
