import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';

const router = Router();

router.post('/feedback', (req: Request, res: Response) => {
  try {
    const { sessionId, messageId, schemeId, rating, comment } = req.body;

    const id = uuidv4();
    db.prepare(`
      INSERT INTO citizen_feedback (id, session_id, message_id, scheme_id, rating, comment)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(id, sessionId || null, messageId || null, schemeId || null, rating || 0, comment || '');

    res.json({ success: true, feedbackId: id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

