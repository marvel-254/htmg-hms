import pg from 'pg';
import { readFileSync } from 'fs';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error('DATABASE_URL required');
  process.exit(1);
}

const { Pool } = pg;
const pool = new Pool({ connectionString, ssl: { rejectUnauthorized: false } });

async function migrate() {
  const sql = readFileSync(new URL('./schema.sql', import.meta.url), 'utf8');
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('Schema applied successfully');
  } catch (err: any) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
