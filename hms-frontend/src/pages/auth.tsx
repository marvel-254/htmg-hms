// Auth pages

import { useState } from 'react';
import { useAuth } from '../hooks';
import { Button, Input, Select } from '../components/primitives';
import { Hospital, UserPlus, ArrowRight, Sparkle } from '@phosphor-icons/react';

export function LoginPage({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(94,106,210,0.03)_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      
      <div className="bg-bg-panel rounded-2xl border border-border-standard shadow-2xl p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand mb-4">
            <Hospital className="w-7 h-7 text-white" weight="bold" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">HMS Login</h1>
          <p className="text-text-tertiary mt-2">Hospital Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@hospital.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="text-sm text-error bg-error/10 border border-error/20 px-3 py-2 rounded-lg">{error}</p>}

          <Button type="submit" className="w-full py-2.5" loading={loading}>
            Sign In
            <ArrowRight className="w-4 h-4" weight="bold" />
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Don't have an account?{' '}
          <button onClick={onSwitchToRegister} className="text-brand-accent font-medium hover:text-brand-hover">
            Register
          </button>
        </p>
      </div>
    </div>
  );
}

export function RegisterPage({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const { register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'receptionist' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.email, form.password, form.name, form.role);
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(94,106,210,0.03)_1px,transparent_1px)] [background-size:16px_16px] opacity-50" />
      
      <div className="bg-bg-panel rounded-2xl border border-border-standard shadow-2xl p-8 w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-brand mb-4">
            <UserPlus className="w-7 h-7 text-white" weight="bold" />
          </div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">HMS Register</h1>
          <p className="text-text-tertiary mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            required
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="At least 6 characters"
            minLength={6}
            required
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            options={[
              { value: 'receptionist', label: 'Receptionist' },
              { value: 'doctor', label: 'Doctor' },
              { value: 'admin', label: 'Admin' },
            ]}
          />

          {error && <p className="text-sm text-error bg-error/10 border border-error/20 px-3 py-2 rounded-lg">{error}</p>}

          <Button type="submit" className="w-full py-2.5" loading={loading}>
            Create Account
            <Sparkle className="w-4 h-4" weight="bold" />
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-6">
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className="text-brand-accent font-medium hover:text-brand-hover">
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
}
