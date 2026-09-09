// Patient management page

import { useState } from 'react';
import { usePatients } from '../hooks';
import { Button, Input, Select, Modal, Card, Loading, ErrorDisplay, EmptyState, confirm } from '../components/primitives';
import { User, Plus, Trash, MagnifyingGlass, MapPin, Phone } from '@phosphor-icons/react';

interface Props {
  onRefresh: () => void;
}

export function PatientList({ onRefresh }: Props) {
  const { patients, loading, error, fetchAll, create, remove } = usePatients();
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', age: '', gender: 'male', contact: '', address: '', condition: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const handleAdd = async () => {
    setErrorMsg('');
    try {
      await create({
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
        await remove(id);
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
        <Button onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" weight="bold" />
          Add Patient
        </Button>
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
      {error && <ErrorDisplay message={error} onRetry={fetchAll} />}
      {errorMsg && <ErrorDisplay message={errorMsg} />}

      {!loading && !error && patients.length === 0 && (
        <EmptyState
          icon={<User className="w-8 h-8" />}
          title="No patients registered yet"
          description="Register your first patient to get started"
          action={{ label: 'Register Patient', onClick: () => setShowAdd(true) }}
        />
      )}

      {!loading && patients.length > 0 && (
        <div className="space-y-2">
          {filtered.map((patient) => (
            <Card key={patient.id} hover className="p-4 flex items-center justify-between">
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
            </Card>
          ))}
        </div>
      )}

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Register Patient">
        <div className="space-y-4">
          <Input
            label="Name *"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Patient name"
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age *"
              type="number"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
              placeholder="Age"
              min={0}
              max={150}
            />
            <Select
              label="Gender *"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
            />
          </div>
          <Input
            label="Phone"
            value={form.contact}
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
            placeholder="+1 234 567 8900"
          />
          <Input
            label="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Address"
          />
          <Input
            label="Condition"
            value={form.condition}
            onChange={(e) => setForm({ ...form, condition: e.target.value })}
            placeholder="e.g. Cold, Hypertension..."
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
