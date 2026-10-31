# SAHAY AI — Project Understanding & Architecture Plan
**Seva First Innovation Challenge Maharashtra 2026**  
**Problem Statement 9.1: AI-Powered Citizen Services and Smart Governance**

---

## 1. Problem Statement
Millions of citizens in Maharashtra encounter substantial barriers when trying to access state and central welfare schemes:
- **Information Fragmentation:** Schemes are scattered across different portals (MahaDBT, Aaple Sarkar, Krishi Vibhag, MJPJAY, etc.).
- **Complex Regulatory Jargon:** Official government notifications are often written in dense administrative terminology that citizens cannot easily decipher.
- **Multilingual Gaps:** Information is frequently inaccessible in simple colloquial Marathi or Hindi.
- **Eligibility Uncertainty:** Citizens often cannot determine whether they qualify before spending time and money queuing at CSC/Setu centers.
- **Document Disconnect:** Incomplete or incorrect documentation is the leading cause of application rejection.

## 2. Solution: SAHAY AI (सहाय्य AI)
**SAHAY AI** is an authentic, source-grounded, multilingual AI citizen services platform designed specifically for the citizens of Maharashtra. It acts as an empathetic, authoritative citizen services guide:
- Understands queries in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.
- Employs **Retrieval-Augmented Generation (RAG)** strictly grounded in verified government data with source citations.
- Provides interactive **Guided Eligibility Checkers** that evaluate citizen profiles against structured criteria without asking for sensitive identifiers (Aadhaar, PAN, OTPs).
- Generates tailored **Interactive Document Checklists** with explanations of why each document is needed.
- Directs citizens to official government portals (MahaDBT, Aaple Sarkar, etc.) with verified application instructions.
- Includes a transparent administrative management suite for updating schemes and re-indexing the knowledge base.

---

## 3. Product Features & Modules

| Module | Core Functionality |
| :--- | :--- |
| **1. Multilingual AI Assistant (Chat)** | Natural language dialogue in Marathi, Hindi, & English; streaming / live chat responses; RAG citations; speech read-aloud support; starter prompts; copy & share responses. |
| **2. Scheme Explorer** | Comprehensive catalog with search, category filtering (Agriculture, Education, Healthcare, Women & Child, Social Justice, Housing), department tags, and verified badges. |
| **3. Scheme Detail Intelligence** | Plain-language breakdown, structured eligibility rules, financial and non-financial benefits, required documents, step-by-step application guidance, official portal links. |
| **4. Guided Eligibility Engine** | Non-invasive citizen profiler (age, gender, income range, caste category, occupation, residence district) providing transparent rule matching (eligible, conditionally eligible, ineligible, missing info). |
| **5. Document Checklist Generator** | Interactive checklist per scheme with actionable document prep tips and official verification notes. |
| **6. Administrative Control Portal** | Ingestion & management of verified government schemes, document chunk inspection, vector re-indexing, audit logs of verified dates. |
| **7. Transparency & Trust Center** | AI disclaimers, anti-hallucination guarantees, privacy safeguards (zero Aadhaar/bank data storage), source URLs. |

---

## 4. Technical Architecture

### Tech Stack
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS + Lucide Icons.
- **Backend:** Node.js (v26) + Express + TypeScript + SQLite (`better-sqlite3` or `sqlite3`) with vector semantic & lexical hybrid retrieval.
- **AI/RAG Engine:** 
  - Grounded RAG with hybrid search (lexical BM25 + cosine vector embedding similarity).
  - Multi-provider AI Adapter: supports **Google Gemini API** (`gemini-1.5-flash` / `gemini-2.0`), **OpenAI API**, and an intelligent **Local Grounded AI Engine** with zero credentials required for offline reliability.
  - Strict anti-hallucination guardrails: if a scheme or detail is unverified in official sources, explicit transparency messages are issued.
- **Multilingual Support:** Complete Marathi, Hindi, and English UI translations, multilingual semantic intent extraction, and language-preserving response rendering.

---

## 5. Development Roadmap
- [x] Phase 1: Problem understanding & architectural specification (`PROJECT_UNDERSTANDING.md`).
- [ ] Phase 2 & 7: Backend setup, SQLite database schema, REST API endpoints, security middleware.
- [ ] Phase 5 & 10: Verified Maharashtra scheme dataset curation & ingestion pipeline.
- [ ] Phase 4 & 6: Multilingual RAG reasoning engine, intent parsing, prompt templates, and AI adapter.
- [ ] Phase 3: Frontend development (Home, AI Chat, Scheme Explorer, Scheme Details, Eligibility Checker, Document Generator, Admin, Trust Center).
- [ ] Phase 8: Scheme management and admin endpoints.
- [ ] Phase 11: End-to-end testing, multilingual validation, error handling, mobile responsiveness.
- [ ] Phase 12: Documentation (`README.md`, `DEPLOYMENT.md`, API documentation).

