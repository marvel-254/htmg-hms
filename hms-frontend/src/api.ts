// HMS API 클라이언트
const API_BASE = '/api';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('htmg_token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data as T;
}

export const api = {
  // 인증
  register: (body: { email: string; password: string; name: string; role: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  login: (body: { email: string; password: string }) =>
    request<{ message: string; user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  getMe: () => request<{ user: User }>('/auth/me'),
  logout: () => request<{ message: string }>('/auth/logout', { method: 'POST' }),
  getUsers: () => request<{ users: User[] }>('/auth/users'),
  updateUserRole: (id: string, role: string) =>
    request<{ message: string; user: User }>(`/auth/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    }),

  // 환자
  getPatients: () => request<{ patients: Patient[] }>('/patients'),
  searchPatients: (q: string) =>
    request<{ patients: Patient[] }>(`/patients/search?q=${encodeURIComponent(q)}`),
  getPatient: (id: string) => request<{ patient: Patient }>(`/patients/${id}`),
  createPatient: (body: Partial<Patient>) =>
    request<{ message: string; patient: Patient }>('/patients', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updatePatient: (id: string, body: Partial<Patient>) =>
    request<{ message: string; patient: Patient }>(`/patients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deletePatient: (id: string) =>
    request<{ message: string }>(`/patients/${id}`, { method: 'DELETE' }),

  // 의사
  getDoctors: () => request<{ doctors: Doctor[] }>('/doctors'),
  searchDoctors: (q: string) =>
    request<{ doctors: Doctor[] }>(`/doctors/search?q=${encodeURIComponent(q)}`),
  getDoctor: (id: string) => request<{ doctor: Doctor }>(`/doctors/${id}`),
  createDoctor: (body: Partial<Doctor>) =>
    request<{ message: string; doctor: Doctor }>('/doctors', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateDoctor: (id: string, body: Partial<Doctor>) =>
    request<{ message: string; doctor: Doctor }>(`/doctors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),
  deleteDoctor: (id: string) =>
    request<{ message: string }>(`/doctors/${id}`, { method: 'DELETE' }),

  // 예약
  getAppointments: () => request<{ appointments: Appointment[] }>('/appointments'),
  getAppointment: (id: string) =>
    request<{ appointment: Appointment }>(`/appointments/${id}`),
  createAppointment: (body: { patient_id: string; doctor_id: string; appt_date: string; appt_time: string }) =>
    request<{ message: string; appointment: Appointment; conflict: boolean }>('/appointments', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  updateAppointmentStatus: (id: string, status: string) =>
    request<{ message: string; appointment: Appointment }>(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
  deleteAppointment: (id: string) =>
    request<{ message: string }>(`/appointments/${id}`, { method: 'DELETE' }),

  // 대시보드
  getStats: () => request<{ stats: Stats }>('/dashboard/stats'),
  getRecentActivity: () =>
    request<{ recentPatients: Patient[]; recentAppointments: Appointment[] }>(
      '/dashboard/recent-activity'
    ),

  // 헬스체크
  health: () => request<{ status: string; timestamp: string }>('/health'),
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'receptionist' | 'doctor';
  created_at?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  contact?: string;
  address?: string;
  condition?: string;
  created_by?: string;
  created_at: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  contact?: string;
  schedule?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  patient_id: string;
  patient_name: string;
  patient_age: number;
  patient_gender: string;
  doctor_id: string;
  doctor_name: string;
  specialization?: string;
  appt_date: string;
  appt_time: string;
  status: 'pending' | 'confirmed' | 'completed';
  booked_by_name?: string;
  created_at: string;
}

export interface Stats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
}
