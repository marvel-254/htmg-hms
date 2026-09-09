import { useState, useEffect } from 'react';
import type { User, Patient, Doctor, Appointment } from './api';

const STORAGE_KEY = 'htmg_token';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY);
    if (!token) {
      setLoading(false);
      return;
    }
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.ok) return r.json();
        throw new Error('인증 만료');
      })
      .then((data: { user: User }) => {
        setUser(data.user);
      })
      .catch(() => {
        localStorage.removeItem(STORAGE_KEY);
        setError('세션이 만료되었습니다. 다시 로그인하세요.');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    const r = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '로그인 실패');
    localStorage.setItem(STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const register = async (email: string, password: string, name: string, role: string) => {
    setError(null);
    const r = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '회원가입 실패');
    localStorage.setItem(STORAGE_KEY, data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem(STORAGE_KEY);
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // ignore
    }
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/patients', {
        headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
      });
      const data = await r.json();
      setPatients(data.patients || []);
    } catch (e: any) {
      setError(e.message || '환자 목록 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (patient: Partial<Patient>) => {
    const r = await fetch('/api/patients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify(patient),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '환자 등록 실패');
    await fetchPatients();
    return data.patient;
  };

  const updatePatient = async (id: string, patient: Partial<Patient>) => {
    const r = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify(patient),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '수정 실패');
    await fetchPatients();
    return data.patient;
  };

  const deletePatient = async (id: string) => {
    await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
    });
    await fetchPatients();
  };

  return { patients, loading, error, fetchPatients, createPatient, updatePatient, deletePatient };
}

export function useDoctors() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/doctors', {
        headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
      });
      const data = await r.json();
      setDoctors(data.doctors || []);
    } catch (e: any) {
      setError(e.message || '의사 목록 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const createDoctor = async (doctor: Partial<Doctor>) => {
    const r = await fetch('/api/doctors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify(doctor),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '의사 등록 실패');
    await fetchDoctors();
    return data.doctor;
  };

  const updateDoctor = async (id: string, doctor: Partial<Doctor>) => {
    const r = await fetch(`/api/doctors/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify(doctor),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '수정 실패');
    await fetchDoctors();
    return data.doctor;
  };

  const deleteDoctor = async (id: string) => {
    await fetch(`/api/doctors/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
    });
    await fetchDoctors();
  };

  return { doctors, loading, error, fetchDoctors, createDoctor, updateDoctor, deleteDoctor };
}

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch('/api/appointments', {
        headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
      });
      const data = await r.json();
      setAppointments(data.appointments || []);
    } catch (e: any) {
      setError(e.message || '예약 목록 로드 실패');
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (appointment: {
    patient_id: string;
    doctor_id: string;
    appt_date: string;
    appt_time: string;
  }) => {
    const r = await fetch('/api/appointments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify(appointment),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '예약 실패');
    await fetchAppointments();
    return data.appointment;
  };

  const updateStatus = async (id: string, status: string) => {
    const r = await fetch(`/api/appointments/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || '상태 변경 실패');
    await fetchAppointments();
    return data.appointment;
  };

  const deleteAppointment = async (id: string) => {
    await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
    });
    await fetchAppointments();
  };

  return { appointments, loading, error, fetchAppointments, createAppointment, updateStatus, deleteAppointment };
}

export function useStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const r = await fetch('/api/dashboard/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem(STORAGE_KEY)}` },
      });
      const data = await r.json();
      setStats(data.stats);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) {
      fetchStats();
    }
  }, []);

  return { stats, loading, fetchStats };
}
