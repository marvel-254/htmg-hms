import { useState } from 'react';
import { useAppointments, usePatients, useDoctors } from './hooks';
import { Modal, Loading, ErrorDisplay, StatusBadge } from './components';
import { Calendar, Plus, Trash, Warning } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function AppointmentList({ onRefresh }: Props) {
  const { appointments, loading, error, fetchAppointments, createAppointment, updateStatus, deleteAppointment } = useAppointments();
  const { patients } = usePatients();
  const { doctors } = useDoctors();

  const [showAdd, setShowAdd] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [doctorSearch, setDoctorSearch] = useState('');
  const [form, setForm] = useState({ patient_id: '', doctor_id: '', appt_date: '', appt_time: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [conflict, setConflict] = useState(false);

  const filteredPatients = patients.filter((p) => p.name.toLowerCase().includes(patientSearch.toLowerCase()));
  const filteredDoctors = doctors.filter(
    (d) => d.name.toLowerCase().includes(doctorSearch.toLowerCase()) || d.specialization.toLowerCase().includes(doctorSearch.toLowerCase())
  );

  const handleAdd = async () => {
    setErrorMsg('');
    setConflict(false);
    try {
      await createAppointment({
        patient_id: form.patient_id,
        doctor_id: form.doctor_id,
        appt_date: form.appt_date,
        appt_time: form.appt_time,
      });
      setShowAdd(false);
      setForm({ patient_id: '', doctor_id: '', appt_date: '', appt_time: '' });
      setPatientSearch('');
      setDoctorSearch('');
      onRefresh();
    } catch (e: any) {
      if (e.message?.includes('conflict') || e.message?.includes('Conflict')) {
        setConflict(true);
        setErrorMsg(e.message);
      } else {
        setErrorMsg(e.message || 'Booking failed');
      }
    }
  };

  const handleStatusChange = async (id: string, status: 'pending' | 'confirmed' | 'completed') => {
    try {
      await updateStatus(id, status);
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || 'Status update failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this appointment?')) {
      try {
        await deleteAppointment(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || 'Delete failed');
      }
    }
  };

  const sorted = [...appointments].sort((a, b) => {
    if (a.appt_date !== b.appt_date) return a.appt_date.localeCompare(b.appt_date);
    return a.appt_time.localeCompare(b.appt_time);
  });

  const statusColors: Record<string, string> = {
    pending: 'bg-warning/10 border-warning/20',
    confirmed: 'bg-brand/10 border-brand/20',
    completed: 'bg-success-alt/10 border-success-alt/20',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Appointment Management</h2>
          <p className="text-sm text-text-muted">Book and manage appointments</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Book Appointment
        </button>
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchAppointments} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}
      {conflict && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex items-center gap-3">
          <Warning className="w-5 h-5 text-warning flex-shrink-0" weight="bold" />
          <p className="text-sm text-warning">{errorMsg}</p>
        </div>
      )}

      {!loading && appointments.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium">No appointments yet</p>
          <p className="text-sm text-text-muted mt-1">Book your first appointment to get started</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-4">
            Book Appointment
          </button>
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div className="space-y-2">
          {sorted.map((apt) => (
            <div
              key={apt.id}
              className={`bg-bg-surface rounded-xl border p-4 hover:border-border-strong transition-colors ${statusColors[apt.status]}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-sm font-medium text-text-secondary">{apt.appt_date}</p>
                    <p className="text-lg font-semibold text-text-primary">{apt.appt_time}</p>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{apt.patient_name}</p>
                    <p className="text-sm text-text-muted">{apt.patient_age}yrs / {apt.patient_gender === 'male' ? 'Male' : apt.patient_gender === 'female' ? 'Female' : 'Other'}</p>
                  </div>
                  <div className="w-px h-8 bg-border-subtle" />
                  <div>
                    <p className="font-medium text-text-primary">{apt.doctor_name}</p>
                    <p className="text-sm text-brand-accent">{apt.specialization}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'confirmed')}
                      className="px-3 py-1 bg-brand text-white text-sm rounded-lg hover:bg-brand-hover transition-colors"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status === 'confirmed' && (
                    <button
                      onClick={() => handleStatusChange(apt.id, 'completed')}
                      className="px-3 py-1 bg-success-alt text-white text-sm rounded-lg hover:bg-success transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(apt.id)}
                    className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => { setShowAdd(false); setConflict(false); setErrorMsg(''); }} title="Book Appointment">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Patient *</label>
            <div className="relative">
              <input
                type="text"
                value={patientSearch}
                onChange={(e) => setPatientSearch(e.target.value)}
                className="w-full px-4 py-2.5"
                placeholder="Search patient name..."
              />
              {patientSearch && filteredPatients.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-standard rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredPatients.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, patient_id: p.id });
                        setPatientSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 border-b border-border-subtle last:border-0 ${form.patient_id === p.id ? 'bg-brand/10 text-brand-accent' : 'text-text-primary'}`}
                    >
                      {p.name} ({p.age}yrs)
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.patient_id && (
              <p className="mt-1 text-sm text-brand-accent font-medium">
                Selected: {patients.find((p) => p.id === form.patient_id)?.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Doctor *</label>
            <div className="relative">
              <input
                type="text"
                value={doctorSearch}
                onChange={(e) => setDoctorSearch(e.target.value)}
                className="w-full px-4 py-2.5"
                placeholder="Search doctor name or specialty..."
              />
              {doctorSearch && filteredDoctors.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-bg-surface border border-border-standard rounded-lg shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredDoctors.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setForm({ ...form, doctor_id: d.id });
                        setDoctorSearch('');
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-white/5 border-b border-border-subtle last:border-0 ${form.doctor_id === d.id ? 'bg-brand/10 text-brand-accent' : 'text-text-primary'}`}
                    >
                      {d.name} - {d.specialization}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {form.doctor_id && (
              <p className="mt-1 text-sm text-brand-accent font-medium">
                Selected: {doctors.find((d) => d.id === form.doctor_id)?.name} ({doctors.find((d) => d.id === form.doctor_id)?.specialization})
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Date *</label>
              <input
                type="date"
                value={form.appt_date}
                onChange={(e) => setForm({ ...form, appt_date: e.target.value })}
                className="w-full px-4 py-2.5"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Time *</label>
              <input
                type="time"
                value={form.appt_time}
                onChange={(e) => setForm({ ...form, appt_time: e.target.value })}
                className="w-full px-4 py-2.5"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setShowAdd(false); setConflict(false); setErrorMsg(''); }}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="btn-primary flex-1"
            >
              Book
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
