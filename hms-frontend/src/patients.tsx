import { useState } from 'react';
import { usePatients } from './hooks';
import { Modal, Loading, ErrorDisplay } from './components';
import { User, Plus, Trash, MagnifyingGlass, MapPin, Phone } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function PatientList({ onRefresh }: Props) {
  const { patients, loading, error, fetchPatients, createPatient, deletePatient } = usePatients();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', contact: '', address: '', condition: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await createPatient({
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender as 'male' | 'female' | 'other',
        contact: form.contact || undefined,
        address: form.address || undefined,
        condition: form.condition || undefined,
      });
      setShowAdd(false);
      setForm({ name: '', age: '', gender: 'male', contact: '', address: '', condition: '' });
      onRefresh();
    } catch (e: any) {
      setErrorMsg(e.message || 'Registration failed');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this patient?')) {
      try {
        await deletePatient(id);
        onRefresh();
      } catch (e: any) {
        setErrorMsg(e.message || 'Delete failed');
      }
    }
  };

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.contact?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-text-primary">Patient Management</h2>
          <p className="text-sm text-text-muted">Register and manage patients</p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" weight="bold" />
          Add Patient
        </button>
      </div>

      <div className="relative">
        <MagnifyingGlass className="absolute left-3 top-2.5 w-4 h-4 text-text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or phone..."
          className="w-full pl-10 pr-4 py-2.5"
        />
      </div>

      {loading && <Loading />}
      {error && <ErrorDisplay message={error} onRetry={fetchPatients} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && patients.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-text-muted" />
          </div>
          <p className="text-text-secondary font-medium">No patients registered yet</p>
          <p className="text-sm text-text-muted mt-1">Register your first patient to get started</p>
          <button onClick={() => setShowAdd(true)} className="btn-primary mt-4">
            Register Patient
          </button>
        </div>
      )}

      {!loading && patients.length > 0 && (
        <div className="space-y-2">
          {filtered.map((patient) => (
            <div
              key={patient.id}
              className="bg-bg-surface rounded-xl border border-border-standard p-4 hover:border-border-strong transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-brand-accent" weight="bold" />
                </div>
                <div>
                  <p className="font-medium text-text-primary">{patient.name}</p>
                  <p className="text-sm text-text-muted">
                    {patient.age}yrs / {patient.gender === 'male' ? 'Male' : patient.gender === 'female' ? 'Female' : 'Other'}
                    {patient.condition ? ` / ${patient.condition}` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {patient.contact && (
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <Phone className="w-3.5 h-3.5" />
                    {patient.contact}
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-center gap-1.5 text-sm text-text-muted">
                    <MapPin className="w-3.5 h-3.5" />
                    {patient.address}
                  </div>
                )}
                <button
                  onClick={() => handleDelete(patient.id)}
                  className="p-2 text-text-muted hover:text-error hover:bg-error/10 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Patient">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="Patient name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Age *</label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className="w-full px-4 py-2.5"
                placeholder="Age"
                min={0}
                max={150}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Gender *</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2.5"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
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
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Address</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="Address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">Condition</label>
            <input
              type="text"
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="w-full px-4 py-2.5"
              placeholder="e.g. Cold, Hypertension..."
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
