// Doctor management page

import { useState } from 'react';
import { useDoctors } from '../hooks';
import { Button, Input, Modal, Card, Loading, ErrorDisplay, EmptyState, confirm } from '../components/primitives';
import { Stethoscope, Plus, Trash, MagnifyingGlass, CalendarBlank } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function DoctorList({ onRefresh }: Props) {
  const { doctors, loading, error, fetchAll, create, remove } = useDoctors();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', specialization: '', contact: '', schedule: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await create({
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
        await remove(id);
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
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" weight="bold" />
          Add Doctor
        </Button>
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
      {error && <ErrorDisplay message={error} onRetry={fetchAll} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && doctors.length === 0 && (
        <EmptyState
          icon={<Stethoscope className="w-8 h-8" />}
          title="No doctors registered yet"
          description="Add your first doctor to get started"
          action={{ label: 'Add Doctor', onClick: () => setShowAdd(true) }}
        />
      )}

      {!loading && doctors.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((doctor) => (
            <Card key={doctor.id} hover className="p-4">
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
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Doctor">
        <div className="space-y-4">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Doctor name"
          />
          <Input
            label="Specialty *"
            value={form.specialization}
            onChange={(e) => setForm({ ...form, specialization: e.target.value })}
            placeholder="e.g. Internal Medicine, Surgery..."
          />
          <Input
            label="Phone"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="+1 234 567 8900"
          />
          <Input
            label="Schedule"
            value={form.schedule}
            onChange={(e) => setForm({ ...form, schedule: e.target.value })}
            placeholder="e.g. Mon-Fri 9:00 AM - 6:00 PM"
          />
          <div className="flex gap-3 pt-2">
            <Button variant="ghost" className="flex-1" onClick={() => setShowAdd(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleAdd}>
              Register
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
