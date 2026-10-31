import { db } from '../db/database.js';
import { parseIntent, LanguageCode, ParsedIntent } from './intentParser.js';

export interface RetrievedScheme {
  id: string;
  slug: string;
  name_en: string;
  name_mr: string;
  name_hi: string;
  department: string;
  government_level: string;
  category: string;
  description_en: string;
  description_mr: string;
  description_hi: string;
  benefits_summary: string;
  max_benefit_amount: string;
  target_beneficiaries: string;
  application_mode: string;
  official_portal_url: string;
  official_guideline_url: string;
  source_name: string;
  source_verified_date: string;
  criteria?: {
    min_age?: number;
    max_age?: number;
    gender: string;
    caste_categories: string[];
    max_income?: number;
    min_income?: number;
    required_occupation: string;
    required_education_status: string;
    maharashtra_domicile_required: boolean;
    additional_conditions_en: string;
    additional_conditions_mr: string;
    additional_conditions_hi: string;
  };
  documents?: Array<{
    document_name_en: string;
    document_name_mr: string;
    document_name_hi: string;
    is_mandatory: boolean;
    purpose_en: string;
    purpose_mr: string;
    purpose_hi: string;
  }>;
  score: number;
}

export interface RAGContext {
  query: string;
  parsedIntent: ParsedIntent;
  schemes: RetrievedScheme[];
  topScheme?: RetrievedScheme;
  sources: Array<{
    scheme_name: string;
    source_name: string;
    official_portal_url: string;
    source_verified_date: string;
  }>;
  confidence: 'high' | 'medium' | 'low' | 'none';
}

export class RAGEngine {
  /**
   * Hybrid retrieval combining target scheme detection, full-text token matching,
   * category filtering, and structured field scoring.
   */
  public static retrieve(query: string, preferredLang?: LanguageCode): RAGContext {
    const parsedIntent = parseIntent(query, preferredLang);
    const allSchemes = db.prepare('SELECT * FROM schemes WHERE active = 1').all() as any[];

    const scoredSchemes: RetrievedScheme[] = [];

    for (const s of allSchemes) {
      let score = 0;

      // 1. Exact Target ID Match (highest priority)
      if (parsedIntent.targetSchemeId && s.id === parsedIntent.targetSchemeId) {
        score += 100;
      }

      // 2. Name matches
      const lowerQuery = query.toLowerCase();
      if (lowerQuery.includes(s.name_en.toLowerCase())) score += 60;
      if (lowerQuery.includes(s.name_mr.toLowerCase())) score += 60;
      if (lowerQuery.includes(s.name_hi.toLowerCase())) score += 60;

      // 3. Category match
      if (parsedIntent.categoryFilter) {
        if (s.category.toLowerCase().includes(parsedIntent.categoryFilter.toLowerCase())) {
          score += 35;
        }
      }

      // 4. Beneficiary match
      if (parsedIntent.targetBeneficiary) {
        if (s.target_beneficiaries.toLowerCase().includes(parsedIntent.targetBeneficiary.toLowerCase())) {
          score += 30;
        }
      }

      // 5. Keyword token scoring against name, description, benefits
      for (const kw of parsedIntent.keywords) {
        if (s.name_en.toLowerCase().includes(kw)) score += 10;
        if (s.name_mr.toLowerCase().includes(kw)) score += 12;
        if (s.name_hi.toLowerCase().includes(kw)) score += 12;
        if (s.description_en.toLowerCase().includes(kw)) score += 5;
        if (s.description_mr.toLowerCase().includes(kw)) score += 6;
        if (s.description_hi.toLowerCase().includes(kw)) score += 6;
        if (s.benefits_summary.toLowerCase().includes(kw)) score += 7;
        if (s.target_beneficiaries.toLowerCase().includes(kw)) score += 6;
      }

      // Check scheme chunks
      const chunks = db.prepare('SELECT chunk_text, keywords FROM scheme_chunks WHERE scheme_id = ?').all(s.id) as any[];
      for (const chunk of chunks) {
        for (const kw of parsedIntent.keywords) {
          if (chunk.keywords && chunk.keywords.toLowerCase().includes(kw)) {
            score += 4;
          }
          if (chunk.chunk_text.toLowerCase().includes(kw)) {
            score += 2;
          }
        }
      }

      // Significant score threshold
      if (score >= 18) {
        // Hydrate criteria
        const criteriaRow = db.prepare('SELECT * FROM eligibility_criteria WHERE scheme_id = ?').get(s.id) as any;
        let criteria;
        if (criteriaRow) {
          criteria = {
            min_age: criteriaRow.min_age ?? undefined,
            max_age: criteriaRow.max_age ?? undefined,
            gender: criteriaRow.gender,
            caste_categories: JSON.parse(criteriaRow.caste_categories || '["All"]'),
            max_income: criteriaRow.max_income ?? undefined,
            min_income: criteriaRow.min_income ?? undefined,
            required_occupation: criteriaRow.required_occupation,
            required_education_status: criteriaRow.required_education_status,
            maharashtra_domicile_required: criteriaRow.maharashtra_domicile_required === 1,
            additional_conditions_en: criteriaRow.additional_conditions_en,
            additional_conditions_mr: criteriaRow.additional_conditions_mr,
            additional_conditions_hi: criteriaRow.additional_conditions_hi
          };
        }

        // Hydrate documents
        const docRows = db.prepare('SELECT * FROM scheme_documents WHERE scheme_id = ?').all(s.id) as any[];
        const documents = docRows.map(d => ({
          document_name_en: d.document_name_en,
          document_name_mr: d.document_name_mr,
          document_name_hi: d.document_name_hi,
          is_mandatory: d.is_mandatory === 1,
          purpose_en: d.purpose_en,
          purpose_mr: d.purpose_mr,
          purpose_hi: d.purpose_hi
        }));

        scoredSchemes.push({
          ...s,
          criteria,
          documents,
          score
        });
      }
    }

    // Sort descending by score
    scoredSchemes.sort((a, b) => b.score - a.score);

    const topSchemes = scoredSchemes.slice(0, 4);

    let confidence: 'high' | 'medium' | 'low' | 'none' = 'none';
    if (topSchemes.length > 0) {
      if (topSchemes[0].score >= 50) confidence = 'high';
      else if (topSchemes[0].score >= 25) confidence = 'medium';
      else if (topSchemes[0].score >= 18) confidence = 'low';
      else confidence = 'none';
    }

    const sources = topSchemes.map(s => ({
      scheme_name: parsedIntent.language === 'mr' ? s.name_mr : parsedIntent.language === 'hi' ? s.name_hi : s.name_en,
      source_name: s.source_name,
      official_portal_url: s.official_portal_url,
      source_verified_date: s.source_verified_date
    }));

    return {
      query,
      parsedIntent,
      schemes: topSchemes,
      topScheme: confidence !== 'none' ? topSchemes[0] : undefined,
      sources,
      confidence
    };
  }
}
