import { readFileSync } from 'fs';
import pg from 'pg';

const cs = process.env.DATABASE_URL;
if (!cs) {
  console.error('DATABASE_URL required');
  process.exit(1);
}

async function migrate() {
  const { Pool } = pg;
  const pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const sql = readFileSync('./src/db/schema.sql', 'utf8');
    await client.query(sql);
    await client.query('COMMIT');
    console.log('✓ Schema applied successfully');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('✗ Migration failed:', err);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();
