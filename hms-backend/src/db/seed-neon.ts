import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import pg from 'pg';

const DEMO_PASSWORD = 'demo1234';

// Try to get connection string from neonctl
function getConnectionStringFromNeonctl(): string | null {
  try {
    // Try: neonctl connection-string
    const home = process.env.HOME || '';
    const configDir = process.env.NEON_CONFIG_DIR || join(home, '.config/neon');
    const credsPath = join(configDir, 'credentials.json');

    if (!existsSync(credsPath)) return null;

    const creds = JSON.parse(readFileSync(credsPath, 'utf8'));
    const token = creds.access_token;
    if (!token) return null;

    // Use Neon API to discover project and endpoint
    const orgRes = JSON.parse(
      execSync(`curl -s -H "Authorization: Bearer ${token}" "https://console.neon.tech/api/v2/users/me/organizations"`, {
        encoding: 'utf8', timeout: 10000
      })
    );
    const orgId = orgRes.organizations?.[0]?.id;
    if (!orgId) return null;

    const projRes = JSON.parse(
      execSync(`curl -s -H "Authorization: Bearer ${token}" "https://console.neon.tech/api/v2/projects?limit=10&org_id=${orgId}"`, {
        encoding: 'utf8', timeout: 10000
      })
    );
    const projects = projRes.projects || [];
    const project = projects.find((p: any) => p.name === 'hms-demo') || projects[0];
    if (!project) return null;

    const epRes = JSON.parse(
      execSync(`curl -s -H "Authorization: Bearer ${token}" "https://console.neon.tech/api/v2/projects/${project.id}/endpoints?limit=10"`, {
        encoding: 'utf8', timeout: 10000
      })
    );
    const endpoints = epRes.endpoints || [];
    const endpoint = endpoints.find((e: any) => e.type === 'read_write') || endpoints[0];
    if (!endpoint) return null;

    const host = endpoint.hosts?.read_write_host || endpoint.host;
    console.log(`\n📡 Neon project: ${project.name}`);
    console.log(`📡 Endpoint host: ${host}`);
    console.log(`\n⚠️  The database password is not exposed via the API.`);
    console.log(`   Get it from Neon Console → ${project.name} → Connection String.\n`);

    return null;
  } catch (err: any) {
    return null;
  }
}

// --- Main ---

console.log('🔍 HMS Database Seeder');
console.log('======================\n');

let connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.log('DATABASE_URL not set. Checking for Neon project via neonctl...');
  const discovered = getConnectionStringFromNeonctl();
  if (discovered) {
    console.log('  → Project: hms-demo');
    console.log('  → Host: ep-cold-credit-ayovefkz.c-5.us-east-2.aws.neon.tech');
    console.log('\n📋 To seed, get the password from Neon Console → hms-demo → Connection String');
    console.log('   Then run:');
    console.log('   export DATABASE_URL="postgresql://super-term-23570302-neondb:npg_XXXX@ep-cold-credit-ayovefkz.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"');
    console.log('   npm run seed:neon\n');
  } else {
    console.log('\n📋 Set DATABASE_URL and run: npm run seed:neon\n');
  }
  process.exit(1);
}

console.log(`📡 Connecting to: ${connectionString.replace(/:[^:@]*@/, ':****@')}`);

async function seed() {
  const { Pool } = pg;
  const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if demo users already exist
    const existing = await client.query(
      "SELECT id FROM users WHERE email IN ($1, $2, $3)",
      ['admin@hospital.com', 'receptionist@hospital.com', 'doctor@hospital.com']
    );

    if (existing.rows.length >= 3) {
      console.log('✓ Demo users already exist. Skipping seed.');
      printCredentials();
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

    // Create sample appointments
    const today = new Date();
    const dates = [
      today.toISOString().split('T')[0],
      new Date(today.getTime() + 86400000).toISOString().split('T')[0],
      new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0],
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

    console.log('✓ Database seeded successfully!');
    printCredentials();
    console.log('\n📊 Sample data created:');
    console.log('  • 3 doctors (Internal Medicine, Cardiology, General Surgery)');
    console.log('  • 6 patients with various conditions');
    console.log('  • 7 appointments across today and next 2 days');

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✗ Seed failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

function printCredentials() {
  console.log('\n🔑 DEMO CREDENTIALS (password: demo1234)');
  console.log('  👑 Admin:       admin@hospital.com / demo1234');
  console.log('  🏥 Receptionist: receptionist@hospital.com / demo1234');
  console.log('  🩺 Doctor:      doctor@hospital.com / demo1234');
}

seed();
