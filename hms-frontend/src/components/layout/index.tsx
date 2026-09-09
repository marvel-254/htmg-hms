// Layout components

import { type ReactNode } from 'react';
import { Hospital, House, Users, Stethoscope, Calendar, SignOut } from '@phosphor-icons/react';
import { useAuth } from '../../hooks';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: House, roles: ['admin', 'receptionist', 'doctor'] },
  { id: 'patients', label: 'Patients', icon: Users, roles: ['admin', 'receptionist'] },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope, roles: ['admin', 'receptionist'] },
  { id: 'appointments', label: 'Appointments', icon: Calendar, roles: ['admin', 'receptionist', 'doctor'] },
];

export const Sidebar = ({ activeView, onViewChange }: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  return (
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
        {filteredNav.map(item => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeView === item.id
                ? 'bg-brand/10 text-brand-accent'
                : 'text-text-secondary hover:bg-white/5 hover:text-text-primary'
            }`}
          >
            <item.icon className="w-4 h-4" weight={activeView === item.id ? 'bold' : 'regular'} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-border-subtle">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center">
            <span className="text-xs font-semibold text-brand-accent">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-text-muted capitalize">{user?.role || 'role'}</p>
          </div>
          <button
            onClick={logout}
            className="text-text-muted hover:text-error transition-colors p-1"
            title="Logout"
          >
            <SignOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

// Main layout shell
interface LayoutProps {
  children: ReactNode;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Layout = ({ children, activeView, onViewChange }: LayoutProps) => (
  <div className="min-h-screen bg-bg-base flex">
    <Sidebar activeView={activeView} onViewChange={onViewChange} />
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto">
        {children}
      </div>
    </main>
  </div>
);
