import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.js';
import patientRoutes from './routes/patients.js';
import doctorRoutes from './routes/doctors.js';
import appointmentRoutes from './routes/appointments.js';
import dashboardRoutes from './routes/dashboard.js';
import { initializeDb, closeDb } from './db/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

// 미들웨어
app.use(cors({
  // Single-service deploy: frontend and API share one origin.
  // Keep CORS open for dev tools / API clients.
  origin: process.env.CORS_ORIGIN || true,
  credentials: true
}));
app.use(express.json());

// API 라우트
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 헬스체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 프로덕션: 빌드된 프론트엔드 서빙 (단일 서비스 배포)
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback: /api 가 아닌 모든 경로는 index.html 로
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.sendFile(path.join(publicDir, 'index.html'), (err) => {
    if (err) next(err);
  });
});

// 글로벌 오류 핸들러
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// DB 초기화 후 서버 시작
async function start(): Promise<void> {
  try {
    await initializeDb();
  } catch (err) {
    console.error('Database initialization failed:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    console.log(`HMS server running on port ${PORT}`);
  });

  // 우아한 종료 (graceful shutdown)
  const shutdown = async (signal: string) => {
    console.log(`${signal} received, shutting down...`);
    server.close(async () => {
      await closeDb();
      process.exit(0);
    });
    // 강제 종료 타이머
    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

// tsx 로 직접 실행될 때만 시작 (테스트 import 시 시작 방지)
if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
