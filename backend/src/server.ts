import express from 'express';
import cors from 'cors';
import { ENV } from './config/env.js';
import { initDatabase, db } from './db/database.js';
import { seedDatabase } from './db/seed.js';
import healthRouter from './routes/health.js';
import chatRouter from './routes/chat.js';
import schemesRouter from './routes/schemes.js';
import eligibilityRouter from './routes/eligibility.js';
import documentsRouter from './routes/documents.js';
import adminRouter from './routes/admin.js';
import feedbackRouter from './routes/feedback.js';

const app = express();

// Initialize Database & Auto-seed if empty
initDatabase();
try {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM schemes').get() as { count: number };
  if (!countRow || countRow.count === 0) {
    console.log('[Server] Database is empty, auto-seeding verified Maharashtra schemes...');
    seedDatabase();
  }
} catch (e) {
  console.warn('[Server] Auto-seed check notice:', e);
}

// Middleware
app.use(cors({
  origin: ENV.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-token']
}));
app.use(express.json({ limit: '5mb' }));

// Request logging in development
if (ENV.NODE_ENV !== 'test') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[HTTP] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// Mount Routes
app.use('/api', healthRouter);
app.use('/api', chatRouter);
app.use('/api', schemesRouter);
app.use('/api', eligibilityRouter);
app.use('/api', documentsRouter);
app.use('/api', adminRouter);
app.use('/api', feedbackRouter);

// Root fallback
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to SAHAY AI Backend API (सहाय्य AI)',
    version: '1.0.0',
    documentation: '/api/health',
    status: 'online'
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Unhandled Error]:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred.'
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(ENV.PORT, () => {
    console.log(`
=====================================================
  SAHAY AI — Citizen Services Platform (Backend)
  Status: RUNNING on http://localhost:${ENV.PORT}
  Environment: ${ENV.NODE_ENV}
  Health Check: http://localhost:${ENV.PORT}/api/health
=====================================================
    `);
  });
}

export default app;

