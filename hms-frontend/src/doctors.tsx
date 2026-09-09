import { useState } from 'react';
import { useDoctors } from './hooks';
import { Modal, Loading, ErrorDisplay } from './components';
import { Stethoscope, Plus, Trash, MagnifyingGlass, CalendarBlank } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function DoctorList({ onRefresh }: Props) {
  const { doctors, loading, error, fetchDoctors, createDoctor, deleteDoctor } = useDoctors();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', specialization: '', contact: '', schedule: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await createDoctor({
        name: form.name,
        specialization: form.specialization,
        contact: form.contact || undefined,
        schedule: form.schedule || undefined,
      });
      setShowAdd(false);
      setForm({ name: '', specialization: '', contact: '', schedule: '' });
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this doctor?')) {
      try {
        await deleteDoctor(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || 'Delete failed');
      }
    }
  };

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Doctor Management</h2>
          <p className="text-sm text-text-muted">Register and manage doctors by specialty</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Doctor
        </button>
      </div>

      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or specialty..."
          className="w-full pl-10 pr-4 py-2.5"
        />
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchDoctors} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && doctors.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Stethoscope className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium">No doctors registered yet</p>
          <p className="text-sm text-text-muted mt-1">Add your first doctor to get started</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-4">
            Add Doctor
          </button>
        </div>
      )}

      {!loading && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((doctor) => (
            <div
              key={doctor.id}
              className="bg-bg-surface rounded-xl border border-border-standard p-4 hover:border-border-strong transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <Stethoscope className="w-5 h-5 text-brand-accent" weight="bold" />
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{doctor.name}</p>
                    <p className="text-sm text-brand-accent">{doctor.specialization}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doctor.id)}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
              {doctor.schedule && (
                <div className="mt-3 pt-3 border-t border-border-subtle flex items-center gap-2">
                  <CalendarBlank className="w-3.5 h-3.5 text-text-muted" />
                  <p className="text-sm text-text-muted">{doctor.schedule}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Doctor">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="Doctor name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Specialty *</label>
            <input
              type="text"
              value={form.specialization}
              onChange={(e) => setForm({ ...form, specialization: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="e.g. Internal Medicine, Surgery..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Phone</label>
            <input
              type="text"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="+1 234 567 8900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Schedule</label>
            <input
              type="text"
              value={form.schedule}
              onChange={(e) => setForm({ ...form, schedule: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="e.g. Mon-Fri 9:00 AM - 6:00 PM"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowAdd(false)}
              className="btn-ghost flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              className="btn-primary flex-1"
            >
              Register
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
