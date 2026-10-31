import { Router, Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/database.js';
import { ENV } from '../config/env.js';
import { seedDatabase } from '../db/seed.js';

const router = Router();

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-admin-token'] || req.query.admin_token;
  if (!token || token !== ENV.ADMIN_TOKEN) {
    res.status(401).json({ error: 'Unauthorized: Invalid or missing administrator token.' });
    return;
  }
  next();
}

// GET all schemes for admin
router.get('/admin/schemes', requireAdmin, (req: Request, res: Response) => {
  try {
    const schemes = db.prepare('SELECT * FROM schemes ORDER BY created_at DESC').all();
    res.json({ schemes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST reindex / reseed knowledge base
router.post('/admin/reindex', requireAdmin, (req: Request, res: Response) => {
  try {
    seedDatabase();
    db.prepare(`
      INSERT INTO admin_audit_log (id, action, details)
      VALUES (?, 'REINDEX_DATABASE', 'Triggered full database re-indexing and seed synchronization')
    `).run(uuidv4());

    res.json({
      success: true,
      message: 'Knowledge base re-indexed and synchronized successfully.'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST update or add scheme
router.post('/admin/schemes', requireAdmin, (req: Request, res: Response) => {
  try {
    const s = req.body;
    if (!s.id || !s.name_en || !s.department) {
      res.status(400).json({ error: 'Missing mandatory fields: id, name_en, department are required.' });
      return;
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO schemes (
        id, slug, name_en, name_mr, name_hi, department, government_level,
        category, description_en, description_mr, description_hi, benefits_summary,
        max_benefit_amount, target_beneficiaries, application_mode,
        official_portal_url, official_guideline_url, source_name,
        source_verified_date, active, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?,
        ?, ?, CURRENT_TIMESTAMP
      )
    `);

    stmt.run(
      s.id,
      s.slug || s.id,
      s.name_en,
      s.name_mr || s.name_en,
      s.name_hi || s.name_en,
      s.department,
      s.government_level || 'State (Maharashtra)',
      s.category || 'General Welfare',
      s.description_en || '',
      s.description_mr || '',
      s.description_hi || '',
      s.benefits_summary || '',
      s.max_benefit_amount || null,
      s.target_beneficiaries || '',
      s.application_mode || 'Online',
      s.official_portal_url || '',
      s.official_guideline_url || '',
      s.source_name || 'Government Resolution',
      s.source_verified_date || new Date().toISOString().split('T')[0],
      s.active !== undefined ? (s.active ? 1 : 0) : 1
    );

    db.prepare(`
      INSERT INTO admin_audit_log (id, action, details)
      VALUES (?, 'UPDATE_SCHEME', ?)
    `).run(uuidv4(), `Updated scheme: ${s.id} (${s.name_en})`);

    res.json({ success: true, schemeId: s.id });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET audit logs
router.get('/admin/audit-logs', requireAdmin, (req: Request, res: Response) => {
  try {
    const logs = db.prepare('SELECT * FROM admin_audit_log ORDER BY created_at DESC LIMIT 50').all();
    res.json({ logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET feedback stats
router.get('/admin/feedback', requireAdmin, (req: Request, res: Response) => {
  try {
    const feedback = db.prepare('SELECT * FROM citizen_feedback ORDER BY created_at DESC LIMIT 50').all();
    res.json({ feedback });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

