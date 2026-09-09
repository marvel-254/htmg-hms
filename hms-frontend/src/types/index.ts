// API types

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

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface ApiError {
  error: string;
}
