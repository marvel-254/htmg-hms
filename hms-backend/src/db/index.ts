import pg from 'pg';

const { Pool } = pg;

let pool: pg.Pool | null = null;

export function getPool(): pg.Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    pool = new Pool({
      connectionString,
      // Render Postgres requires SSL
      ssl: process.env.PGSSLDISABLE ? false : { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    });
  }
  return pool;
}

// Parameterized query helper: query<T>('SELECT ... WHERE id = $1', [id])
export async function query<T extends pg.QueryResultRow = any>(
  text: string,
  params: unknown[] = []
): Promise<pg.QueryResult<T>> {
  const p = getPool();
  return p.query<T>(text, params);
}

export async function initializeDb(): Promise<void> {
  const p = getPool();

  // 테이블 생성
  await p.query(`
    -- 사용자 테이블 (인증 + 역할)
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'receptionist', 'doctor')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- 환자 테이블
    CREATE TABLE IF NOT EXISTS patients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      gender TEXT NOT NULL CHECK (gender IN ('male', 'female', 'other')),
      contact TEXT,
      address TEXT,
      condition TEXT,
      created_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- 의사 테이블
    CREATE TABLE IF NOT EXISTS doctors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      specialization TEXT NOT NULL,
      contact TEXT,
      schedule TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- 예약 테이블
    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      patient_id TEXT NOT NULL,
      doctor_id TEXT NOT NULL,
      appt_date TEXT NOT NULL,
      appt_time TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed')),
      booked_by TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      FOREIGN KEY (patient_id) REFERENCES patients(id),
      FOREIGN KEY (doctor_id) REFERENCES doctors(id),
      FOREIGN KEY (booked_by) REFERENCES users(id)
    );
  `);

  // 색인 (성능 최적화)
  await p.query(`
    CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name);
    CREATE INDEX IF NOT EXISTS idx_doctors_specialization ON doctors(specialization);
    CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appt_date);
    CREATE INDEX IF NOT EXISTS idx_appointments_doctor_date_time ON appointments(doctor_id, appt_date, appt_time);
  `);

  console.log('Database initialized successfully');
}

export async function closeDb(): Promise<void> {
  if (pool) {
    await pool.end();
    pool = null;
  }
}
