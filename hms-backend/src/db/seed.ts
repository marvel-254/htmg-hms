import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL environment variable is required');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

const DEMO_PASSWORD = 'demo1234';

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if demo users already exist
    const existing = await client.query(
      "SELECT id FROM users WHERE email IN ($1, $2, $3)",
      ['admin@hospital.com', 'receptionist@hospital.com', 'doctor@hospital.com']
    );

    if (existing.rows.length >= 3) {
      console.log('Demo users already exist. Skipping seed.');
      console.log('\n=== DEMO CREDENTIALS ===');
      console.log('Admin:    admin@hospital.com / demo1234');
      console.log('Recep:    receptionist@hospital.com / demo1234');
      console.log('Doctor:   doctor@hospital.com / demo1234');
      await client.query('COMMIT');
      await pool.end();
      return;
    }

    // Create users
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    const adminId = uuidv4();
    const recepId = uuidv4();
    const doctorId = uuidv4();

    await client.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10),
       ($11, $12, $13, $14, $15)
       ON CONFLICT (email) DO NOTHING`,
      [
        adminId, 'admin@hospital.com', passwordHash, 'Admin User', 'admin',
        recepId, 'receptionist@hospital.com', passwordHash, 'Sarah Johnson', 'receptionist',
        doctorId, 'doctor@hospital.com', passwordHash, 'Dr. Michael Chen', 'doctor',
      ]
    );

    // Create doctors
    const drChenId = uuidv4();
    const drPatelId = uuidv4();
    const drWilliamsId = uuidv4();

    await client.query(
      `INSERT INTO doctors (id, name, specialization, contact, schedule) VALUES
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10),
       ($11, $12, $13, $14, $15)
       ON CONFLICT DO NOTHING`,
      [
        drChenId, 'Dr. Michael Chen', 'Internal Medicine', '+1-555-0101', 'Mon-Fri 9:00 AM - 5:00 PM',
        drPatelId, 'Dr. Priya Patel', 'Cardiology', '+1-555-0102', 'Mon-Wed 10:00 AM - 6:00 PM, Thu-Fri 8:00 AM - 4:00 PM',
        drWilliamsId, 'Dr. James Williams', 'General Surgery', '+1-555-0103', 'Tue-Thu 8:00 AM - 12:00 PM, Fri 1:00 PM - 5:00 PM',
      ]
    );

    // Create patients
    const patientIds: string[] = [];
    const patients = [
      ['Emma Rodriguez', 34, 'female', '+1-555-1001', '123 Oak Street, Springfield', 'Hypertension'],
      ['David Kim', 45, 'male', '+1-555-1002', '456 Pine Avenue, Shelbyville', 'Type 2 Diabetes'],
      ['Sophie Thompson', 28, 'female', '+1-555-1003', '789 Maple Drive, Capital City', 'Asthma'],
      ['Robert Martinez', 62, 'male', '+1-555-1004', '321 Cedar Lane, Ogdenville', 'Arthritis'],
      ['Lisa Brown', 39, 'female', '+1-555-1005', '654 Birch Road, North Haverbrook', 'Migraine'],
      ['James Wilson', 51, 'male', '+1-555-1006', '987 Elm Street, Brockway', 'High Cholesterol'],
    ];

    for (const [name, age, gender, contact, address, condition] of patients) {
      const id = uuidv4();
      patientIds.push(id);
      await client.query(
        `INSERT INTO patients (id, name, age, gender, contact, address, condition, created_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT DO NOTHING`,
        [id, name, age, gender, contact, address, condition, recepId]
      );
    }

    // Create sample appointments for today and upcoming days
    const today = new Date();
    const dates = [
      today.toISOString().split('T')[0],
      new Date(today.getTime() + 86400000).toISOString().split('T')[0], // tomorrow
      new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0], // day after
    ];

    const appointmentData = [
      [patientIds[0], drChenId, dates[0], '09:00', 'confirmed'],
      [patientIds[1], drPatelId, dates[0], '10:30', 'pending'],
      [patientIds[2], drWilliamsId, dates[0], '14:00', 'completed'],
      [patientIds[3], drChenId, dates[1], '09:30', 'confirmed'],
      [patientIds[4], drPatelId, dates[1], '11:00', 'pending'],
      [patientIds[5], drWilliamsId, dates[2], '15:00', 'pending'],
      [patientIds[0], drPatelId, dates[2], '10:00', 'pending'],
    ];

    for (const [patientId, doctorId, date, time, status] of appointmentData) {
      await client.query(
        `INSERT INTO appointments (id, patient_id, doctor_id, appt_date, appt_time, status, booked_by)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT DO NOTHING`,
        [uuidv4(), patientId, doctorId, date, time, status, recepId]
      );
    }

    await client.query('COMMIT');

    console.log('Database seeded successfully!');
    console.log('\n=== DEMO CREDENTIALS ===');
    console.log('  Admin:       admin@hospital.com / demo1234');
    console.log('  Receptionist: receptionist@hospital.com / demo1234');
    console.log('  Doctor:      doctor@hospital.com / demo1234');
    console.log('\nAll users have the same password: demo1234');
    console.log('\nSample data created:');
    console.log('  - 3 doctors (Internal Medicine, Cardiology, General Surgery)');
    console.log('  - 6 patients with various conditions');
    console.log('  - 7 appointments across today and next 2 days');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
