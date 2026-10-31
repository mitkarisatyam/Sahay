export type LanguageCode = 'en' | 'mr' | 'hi';

export interface Scheme {
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
  max_benefit_amount?: string;
  target_beneficiaries: string;
  application_mode: string;
  official_portal_url: string;
  official_guideline_url?: string;
  source_name: string;
  source_verified_date: string;
  active: boolean | number;
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
  documents?: SchemeDocument[];
}

export interface SchemeDocument {
  id?: string;
  document_name_en: string;
  document_name_mr: string;
  document_name_hi: string;
  is_mandatory: boolean;
  purpose_en: string;
  purpose_mr: string;
  purpose_hi: string;
  alternative_documents?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  language?: LanguageCode;
  sources?: Array<{
    scheme_name: string;
    source_name: string;
    official_portal_url: string;
    source_verified_date: string;
  }>;
  related_schemes?: Array<{
    id: string;
    slug: string;
    name: string;
    category: string;
    benefits: string;
    official_portal_url: string;
  }>;
  document_checklist?: Array<{
    name: string;
    is_mandatory: boolean;
    purpose: string;
  }>;
  eligibility_guidance?: string[];
  disclaimer?: string;
  createdAt?: string;
  provider?: string;
}

export interface EligibilityResult {
  scheme_id: string;
  scheme_slug: string;
  scheme_name: string;
  category: string;
  department: string;
  status: 'Eligible' | 'Conditionally Eligible' | 'Ineligible';
  benefits_summary: string;
  official_portal_url: string;
  satisfied_conditions: string[];
  unmet_conditions: string[];
  pending_verifications: string[];
  required_documents: Array<{
    name: string;
    is_mandatory: boolean;
    purpose: string;
  }>;
}

