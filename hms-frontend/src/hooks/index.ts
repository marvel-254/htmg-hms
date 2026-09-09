import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';
import type { User, Patient, Doctor, Appointment, Stats } from '../types';

const TOKEN_KEY = 'htmg_token';

// Auth hook
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    api.get<{ user: User }>('/auth/me')
      .then(data => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setError('Session expired. Please log in again.');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const res = await api.post<{ user: User; token: string }>('/auth/login', { email, password });
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    setError(null);
    const res = await api.post<{ user: User; token: string }>('/auth/register', { email, password, name, role });
    localStorage.setItem(TOKEN_KEY, res.token);
    setUser(res.user);
    return res.user;
  };

  const logout = async () => {
    try { await api.post('/auth/logout', {}); } catch { /* ignore */ }
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
}

// Patients hook
export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{ patients: Patient[] }>('/patients');
      setPatients(data.patients);
    } catch (e: any) {
      setError(e.message || 'Failed to load patients');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (patient: Partial<Patient>) => {
    const res = await api.post<{ patient: Patient }>('/patients', patient);
    await fetchAll();
    return res.patient;
  };

  const update = async (id: string, patient: Partial<Patient>) => {
    const res = await api.put<{ patient: Patient }>(`/patients/${id}`, patient);
    await fetchAll();
    return res.patient;
  };

  const remove = async (id: string) => {
    await api.delete(`/patients/${id}`);
    await fetchAll();
  };

  return { patients, loading, error, fetchAll, create, update, remove };
}

// Doctors hook
export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{ doctors: Doctor[] }>('/doctors');
      setDoctors(data.doctors);
    } catch (e: any) {
      setError(e.message || 'Failed to load doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (doctor: Partial<Doctor>) => {
    const res = await api.post<{ doctor: Doctor }>('/doctors', doctor);
    await fetchAll();
    return res.doctor;
  };

  const update = async (id: string, doctor: Partial<Doctor>) => {
    const res = await api.put<{ doctor: Doctor }>(`/doctors/${id}`, doctor);
    await fetchAll();
    return res.doctor;
  };

  const remove = async (id: string) => {
    await api.delete(`/doctors/${id}`);
    await fetchAll();
  };

  return { doctors, loading, error, fetchAll, create, update, remove };
}

// Appointments hook
export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.get<{ appointments: Appointment[] }>('/appointments');
      setAppointments(data.appointments);
    } catch (e: any) {
      setError(e.message || 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  const create = async (appt: { patient_id: string; doctor_id: string; appt_date: string; appt_time: string }) => {
    const res = await api.post<{ appointment: Appointment }>('/appointments', appt);
    await fetchAll();
    return res.appointment;
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await api.put<{ appointment: Appointment }>(`/appointments/${id}/status`, { status });
    await fetchAll();
    return res.appointment;
  };

  const remove = async (id: string) => {
    await api.delete(`/appointments/${id}`);
    await fetchAll();
  };

  return { appointments, loading, error, fetchAll, create, updateStatus, remove };
}

// Stats hook
export function useStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get<{ stats: Stats }>('/dashboard/stats');
      setStats(data.stats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  return { stats, loading, fetchStats };
}
