import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { ENV } from '../config/env.js';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  try {
    const schemeCountRow = db.prepare('SELECT COUNT(*) as count FROM schemes WHERE active = 1').get() as { count: number };
    const chunkCountRow = db.prepare('SELECT COUNT(*) as count FROM scheme_chunks').get() as { count: number };

    res.json({
      status: 'healthy',
      app: 'SAHAY AI — Citizen Services Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        active_schemes: schemeCountRow.count,
        indexed_chunks: chunkCountRow.count,
      },
      ai_providers: {
        gemini_configured: !!ENV.GEMINI_API_KEY,
        openai_configured: !!ENV.OPENAI_API_KEY,
        local_grounded_active: true,
      },
      supported_languages: ['en', 'mr', 'hi']
    });
  } catch (error: any) {
    res.status(500).json({
      status: 'unhealthy',
      error: error.message
    });
  }
});

export default router;

