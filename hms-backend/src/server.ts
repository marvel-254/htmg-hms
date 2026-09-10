import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import dashboardRoutes from './routes/dashboard.js';
import { initializeDb, closeDb } from './db/index.js';

const app = express();
const PORT = process.env.PORT || 3001;

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

  startKeepAlive();

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

// Keep-alive for Render free tier
const KEEP_ALIVE_INTERVAL_MS = Number(process.env.KEEP_ALIVE_INTERVAL_MS || 10 * 60 * 1000);

function startKeepAlive(): void {
  const baseUrl = process.env.RENDER_EXTERNAL_URL;
  if (!baseUrl) {
    console.log('Keep-alive disabled (RENDER_EXTERNAL_URL not set)');
    return;
  }

  const ping = async (): Promise<void> => {
    try {
      const res = await fetch(`${baseUrl}/api/health`);
      console.log(`Keep-alive ping: ${res.status}`);
    } catch (err) {
      console.error('Keep-alive ping failed:', err);
    }
  };

  const timer = setInterval(ping, KEEP_ALIVE_INTERVAL_MS);
  timer.unref();
  console.log(`Keep-alive enabled: pinging ${baseUrl}/api/health every ${KEEP_ALIVE_INTERVAL_MS / 60000} min`);
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
