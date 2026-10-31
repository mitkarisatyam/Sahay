import Database from 'better-sqlite3';
import { ENV } from '../config/env.js';
import path from 'path';
import fs from 'fs';

// Ensure directory exists
const dbDir = path.dirname(ENV.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export const db = new Database(ENV.DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS schemes (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      name_en TEXT NOT NULL,
      name_mr TEXT NOT NULL,
      name_hi TEXT NOT NULL,
      department TEXT NOT NULL,
      government_level TEXT DEFAULT 'State (Maharashtra)',
      category TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_mr TEXT NOT NULL,
      description_hi TEXT NOT NULL,
      benefits_summary TEXT NOT NULL,
      max_benefit_amount TEXT,
      target_beneficiaries TEXT NOT NULL,
      application_mode TEXT DEFAULT 'Online',
      official_portal_url TEXT NOT NULL,
      official_guideline_url TEXT,
      source_name TEXT NOT NULL,
      source_verified_date TEXT NOT NULL,
      active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS eligibility_criteria (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      min_age INTEGER,
      max_age INTEGER,
      gender TEXT, -- 'All', 'Female', 'Male', 'Transgender'
      caste_categories TEXT, -- JSON array: e.g. ["All"] or ["SC", "ST"]
      max_income INTEGER, -- Annual income in INR (null if no limit)
      min_income INTEGER,
      required_occupation TEXT, -- e.g. 'Farmer', 'Student', 'Destitute', 'All'
      required_education_status TEXT, -- e.g. 'Post-Matric', 'Higher Secondary', 'Any'
      maharashtra_domicile_required INTEGER DEFAULT 1,
      additional_conditions_en TEXT,
      additional_conditions_mr TEXT,
      additional_conditions_hi TEXT,
      FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scheme_documents (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      document_name_en TEXT NOT NULL,
      document_name_mr TEXT NOT NULL,
      document_name_hi TEXT NOT NULL,
      is_mandatory INTEGER DEFAULT 1,
      purpose_en TEXT NOT NULL,
      purpose_mr TEXT NOT NULL,
      purpose_hi TEXT NOT NULL,
      alternative_documents TEXT,
      FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scheme_chunks (
      id TEXT PRIMARY KEY,
      scheme_id TEXT NOT NULL,
      chunk_type TEXT NOT NULL, -- 'overview', 'eligibility', 'benefits', 'documents', 'application'
      chunk_text TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      keywords TEXT,
      FOREIGN KEY (scheme_id) REFERENCES schemes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS chat_sessions (
      id TEXT PRIMARY KEY,
      language TEXT DEFAULT 'en',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      role TEXT NOT NULL, -- 'user', 'assistant'
      content TEXT NOT NULL,
      language TEXT DEFAULT 'en',
      sources_json TEXT,
      metadata_json TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS citizen_feedback (
      id TEXT PRIMARY KEY,
      session_id TEXT,
      message_id TEXT,
      scheme_id TEXT,
      rating INTEGER, -- 1 to 5, or 1/-1
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_audit_log (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- Indices for quick lookup
    CREATE INDEX IF NOT EXISTS idx_schemes_category ON schemes(category);
    CREATE INDEX IF NOT EXISTS idx_schemes_active ON schemes(active);
    CREATE INDEX IF NOT EXISTS idx_scheme_chunks_scheme_id ON scheme_chunks(scheme_id);
    CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);
  `);
}

