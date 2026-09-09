import { useAppointments } from './hooks';
import { Loading } from './components';
import { Calendar, CheckCircle, Clock, Stethoscope } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function Dashboard({ }: Props) {
  const { appointments, loading } = useAppointments();

  if (loading) {
    return <Loading />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.appt_date === todayStr).length;
  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const pendingAppointments = appointments.filter((a) => a.status === 'pending').length;

  const stats = [
    {
      label: "Today's Appointments",
      value: todayAppointments,
      icon: Calendar,
      color: 'text-brand-accent',
      bg: 'bg-brand/10',
    },
    {
      label: 'Completed',
      value: completedAppointments,
      icon: CheckCircle,
      color: 'text-success-alt',
      bg: 'bg-success-alt/10',
    },
    {
      label: 'Pending',
      value: pendingAppointments,
      icon: Clock,
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      label: 'Total Appointments',
      value: appointments.length,
      icon: Stethoscope,
      color: 'text-text-secondary',
      bg: 'bg-white/5',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-text-primary">Dashboard</h2>
        <p className="text-sm text-text-muted">Hospital operations summary</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-bg-surface rounded-xl border border-border-standard p-4 hover:border-border-strong transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} weight="bold" />
              </div>
              <div>
                <p className="text-xs text-text-muted">{stat.label}</p>
                <p className="text-2xl font-semibold text-text-primary">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment progress */}
      <div className="bg-bg-surface rounded-xl border border-border-standard p-6">
        <h3 className="text-base font-semibold text-text-primary mb-4">Appointment Progress</h3>
        <div className="flex items-center gap-6">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-text-secondary">Confirmed</span>
              <span className="font-medium text-text-primary">{appointments.filter((a) => a.status === 'confirmed').length}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-success-alt h-2 rounded-full transition-all"
                style={{
                  width: appointments.length > 0
                    ? `${(appointments.filter((a) => a.status === 'confirmed').length / appointments.length) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-text-secondary">Pending</span>
              <span className="font-medium text-text-primary">{pendingAppointments}</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-2">
              <div
                className="bg-warning h-2 rounded-full transition-all"
                style={{
                  width: appointments.length > 0
                    ? `${(pendingAppointments / appointments.length) * 100}%`
                    : '0%',
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
