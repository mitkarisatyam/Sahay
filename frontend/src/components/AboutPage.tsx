import React from 'react';
import { LanguageCode } from '../types';
import { ShieldCheck, Lock, Sparkles, Database, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  language: LanguageCode;
  onNavigate: (tab: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ language, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#167D83] text-xs font-semibold border border-teal-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Trust, Ethics & Smart Governance</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About SAHAY AI (सहाय्य AI)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mx-auto">
          Built for the Seva First Innovation Challenge Maharashtra 2026 under Problem Statement 9.1: AI-Powered Citizen Services and Smart Governance.
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-teal-600" />
          <span>Our Civic Mission</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          While the Government of Maharashtra runs dozens of progressive welfare schemes, millions of deserving citizens remain excluded due to complex administrative terminology, scattered online portals, and language barriers.
        </p>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          <strong>SAHAY AI</strong> bridges this gap by transforming static Government Resolutions (GRs) into interactive, empathetic, source-grounded multilingual guidance in <strong>Marathi (मराठी)</strong>, <strong>Hindi (हिंदी)</strong>, and <strong>English</strong>.
        </p>
      </div>

      {/* 7-Stage Architectural Pipeline */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 text-center">
          The SAHAY AI End-to-End Pipeline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">1. Citizen Inquiry</span>
            <p className="text-slate-600">
              Citizens submit natural language inquiries by text or voice in their mother tongue without knowing formal scheme names.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">2. Multilingual Intent Parser</span>
            <p className="text-slate-600">
              Identifies language, intent (search, eligibility, documents, portal), and target beneficiary attributes without asking for personal IDs.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">3. Hybrid RAG Retrieval</span>
            <p className="text-slate-600">
              Queries structured SQLite database combining lexical tokens and chunk relevance scores strictly against verified government records.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">4. Strict Anti-Hallucination Guardrail</span>
            <p className="text-slate-600">
              If an answer cannot be grounded in official GR records, the system explicitly communicates uncertainty rather than guessing.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">5. Structured Eligibility Evaluation</span>
            <p className="text-slate-600">
              Evaluates age, gender, caste, income, and occupation against hard criteria rules to return transparent matches.
            </p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-teal-700 block text-sm">6. Actionable Checklist & Portal Links</span>
            <p className="text-slate-600">
              Outputs step-by-step document checklists and direct URLs to official portals like MahaDBT and Aaple Sarkar.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Pledge */}
      <div className="bg-gradient-to-tr from-teal-50 to-emerald-50 p-6 sm:p-8 rounded-2xl border border-teal-200 space-y-4">
        <div className="flex items-center space-x-3 text-teal-900">
          <Lock className="w-6 h-6 text-teal-700" />
          <h2 className="text-lg font-bold">Privacy & Citizen Security Pledge</h2>
        </div>
        <p className="text-xs sm:text-sm text-teal-950 leading-relaxed">
          SAHAY AI adheres strictly to the principle of <strong>Zero Unnecessary Data Collection</strong>:
        </p>
        <ul className="space-y-2 text-xs sm:text-sm text-teal-900">
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We <strong>NEVER</strong> ask for or store Aadhaar numbers, PAN cards, or OTPs.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>We <strong>NEVER</strong> ask for bank account credentials or payment details.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All eligibility queries are evaluated in-memory without persistent user tracking.</span>
          </li>
          <li className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official application submission occurs only on official Government portals.</span>
          </li>
        </ul>
      </div>

      {/* Disclaimers & Official Limitations */}
      <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-3 text-xs text-amber-900">
        <div className="flex items-center space-x-2 font-bold text-sm text-amber-950">
          <AlertCircle className="w-4 h-4 text-amber-700" />
          <span>Informational Disclaimer</span>
        </div>
        <p className="leading-relaxed">
          SAHAY AI is an educational and guidance assistant designed to improve administrative transparency. SAHAY AI is not an approving authority and does not disburse government funds directly. Final sanction, benefit disbursement, and official eligibility certification are subject to verification by competent government authorities under relevant Government Resolutions (GRs).
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => onNavigate('chat')}
          className="px-6 py-3 bg-[#167D83] hover:bg-[#13666b] text-white rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center space-x-2 transition-colors shadow-sm cursor-pointer"
        >
          <span>Start Conversing with SAHAY AI</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

