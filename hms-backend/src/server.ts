import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import dashboardRoutes from './routes/dashboard.js';
import { initializeDb, closeDb } from './db/index.js';

// Lazy DB initialization for serverless (Netlify Functions)
let dbReady = false;
async function ensureDb(): Promise<void> {
  if (!dbReady) {
    await initializeDb();
    dbReady = true;
  }
}

const app = express();
const PORT = process.env.PORT || 3001;

// Ensure DB is initialized before handling requests
app.use(async (req, res, next) => {
  try {
    await ensureDb();
    next();
  } catch (err) {
    console.error('Database initialization failed:', err);
    res.status(500).json({ error: 'Database error' });
  }
});

// CORS - allow the frontend origin in production, open in dev
app.use(cors({
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));
app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start(): Promise<void> {
  try {
    await initializeDb();
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`HMS API running on port ${PORT}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// Only start the server if this file is run directly (not imported as a module)
// This allows the app to be imported by serverless-http for Netlify Functions
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  start();
}

export default app;
