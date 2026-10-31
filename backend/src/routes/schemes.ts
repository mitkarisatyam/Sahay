import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { RAGEngine } from '../ai/ragEngine.js';
import { LanguageCode } from '../ai/intentParser.js';

const router = Router();

// GET all schemes with optional filters
router.get('/schemes', (req: Request, res: Response) => {
  try {
    const { category, search, lang } = req.query;
    let query = 'SELECT * FROM schemes WHERE active = 1';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search && typeof search === 'string' && search.trim()) {
      query += ' AND (name_en LIKE ? OR name_mr LIKE ? OR name_hi LIKE ? OR description_en LIKE ?)';
      const s = `%${search.trim()}%`;
      params.push(s, s, s, s);
    }

    query += ' ORDER BY created_at ASC';

    const schemes = db.prepare(query).all(...params) as any[];

    // Hydrate criteria and documents for each
    const fullSchemes = schemes.map(s => {
      const criteria = db.prepare('SELECT * FROM eligibility_criteria WHERE scheme_id = ?').get(s.id) as any;
      const documents = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all(s.id) as any[];

      return {
        ...s,
        criteria: criteria ? {
          ...criteria,
          caste_categories: JSON.parse(criteria.caste_categories || '["All"]'),
          maharashtra_domicile_required: criteria.maharashtra_domicile_required === 1
        } : null,
        documents: documents.map(d => ({
          ...d,
          is_mandatory: d.is_mandatory === 1
        }))
      };
    });

    res.json({
      count: fullSchemes.length,
      schemes: fullSchemes
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET scheme by ID or slug
router.get('/schemes/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const scheme = db.prepare('SELECT * FROM schemes WHERE id = ? OR slug = ?').get(id, id) as any;

    if (!scheme) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }

    const criteria = db.prepare('SELECT * FROM eligibility_criteria WHERE scheme_id = ?').get(scheme.id) as any;
    const documents = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all(scheme.id) as any[];
    const chunks = db.prepare('SELECT chunk_type, chunk_text, language FROM scheme_chunks WHERE scheme_id = ?').all(scheme.id);

    res.json({
      ...scheme,
      criteria: criteria ? {
        ...criteria,
        caste_categories: JSON.parse(criteria.caste_categories || '["All"]'),
        maharashtra_domicile_required: criteria.maharashtra_domicile_required === 1
      } : null,
      documents: documents.map(d => ({
        ...d,
        is_mandatory: d.is_mandatory === 1
      })),
      chunks
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST semantic search
router.post('/schemes/search', (req: Request, res: Response) => {
  try {
    const { query, language } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const ragContext = RAGEngine.retrieve(query, language as LanguageCode);
    res.json({
      query,
      language: ragContext.parsedIntent.language,
      intent: ragContext.parsedIntent.intent,
      results: ragContext.schemes,
      confidence: ragContext.confidence
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

