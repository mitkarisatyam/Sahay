import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.post('/documents/checklist', (req: Request, res: Response) => {
  try {
    const { schemeId, language } = req.body;
    const lang = language || 'en';

    if (!schemeId) {
      res.status(400).json({ error: 'schemeId is required' });
      return;
    }

    const scheme = db.prepare('SELECT * FROM schemes WHERE id = ? OR slug = ?').get(schemeId, schemeId) as any;
    if (!scheme) {
      res.status(404).json({ error: 'Scheme not found' });
      return;
    }

    const docs = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all(scheme.id) as any[];

    const checklist = docs.map((d, index) => ({
      id: d.id,
      step: index + 1,
      document_name: lang === 'mr' ? d.document_name_mr : lang === 'hi' ? d.document_name_hi : d.document_name_en,
      is_mandatory: d.is_mandatory === 1,
      purpose: lang === 'mr' ? d.purpose_mr : lang === 'hi' ? d.purpose_hi : d.purpose_en,
      alternative_documents: d.alternative_documents || null,
      tip: lang === 'mr'
        ? 'मूळ कागदपत्रांची प्रत आणि स्वयंसाक्षांकित छायाप्रत (Self-attested copy) जवळ ठेवा.'
        : lang === 'hi'
        ? 'मूल प्रति और स्व-प्रमाणित छायाप्रति (Self-attested copy) साथ रखें।'
        : 'Keep the original document and a self-attested photocopy ready.'
    }));

    res.json({
      scheme_id: scheme.id,
      scheme_name: lang === 'mr' ? scheme.name_mr : lang === 'hi' ? scheme.name_hi : scheme.name_en,
      department: scheme.department,
      official_portal_url: scheme.official_portal_url,
      total_documents: checklist.length,
      mandatory_count: checklist.filter(d => d.is_mandatory).length,
      checklist,
      source: {
        name: scheme.source_name,
        verified_date: scheme.source_verified_date
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

