import { z } from 'zod';

// 인증 스키마
export const registerSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  role: z.enum(['admin', 'receptionist', 'doctor'], {
    required_error: '역할을 선택하세요',
    invalid_type_error: '유효하지 않은 역할입니다'
  })
});

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요')
});

// 환자 스키마
export const createPatientSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  age: z.number().int().positive('나이는 양수여야 합니다').max(150, '유효하지 않은 나이입니다'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: '성별을 선택하세요',
    invalid_type_error: '유효하지 않은 성별입니다'
  }),
  contact: z.string().optional(),
  address: z.string().optional(),
  condition: z.string().optional()
});

export const updatePatientSchema = createPatientSchema.partial();

// 의사 스키마
export const createDoctorSchema = z.object({
  name: z.string().min(2, '이름은 2자 이상이어야 합니다'),
  specialization: z.string().min(2, '전문 분야를 입력하세요'),
  contact: z.string().optional(),
  schedule: z.string().optional()
});

export const updateDoctorSchema = createDoctorSchema.partial();

// 예약 스키마
export const createAppointmentSchema = z.object({
  patient_id: z.string().min(1, '환자를 선택하세요'),
  doctor_id: z.string().min(1, '의사를 선택하세요'),
  appt_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜는 YYYY-MM-DD 형식이어야 합니다'),
  appt_time: z.string().regex(/^\d{2}:\d{2}$/, '시간은 HH:MM 형식이어야 합니다')
});

export const updateAppointmentStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'completed'], {
    required_error: '상태를 선택하세요',
    invalid_type_error: '유효하지 않은 상태입니다'
  })
});

// 타입 추론
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type UpdateDoctorInput = z.infer<typeof updateDoctorSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentStatusInput = z.infer<typeof updateAppointmentStatusSchema>;
