# SAHAY AI (सहाय्य AI)
### Multilingual AI-Powered Citizen Services Platform for Maharashtra
**Seva First Innovation Challenge Maharashtra 2026**  
**Problem Statement 9.1: AI-Powered Citizen Services and Smart Governance**

---

## 🏛️ Executive Summary

**SAHAY AI** is an authentic, source-grounded, multilingual AI citizen-services platform built specifically to bridge the divide between citizens and Maharashtra Government welfare schemes.

Many citizens struggle with complex administrative jargon, fragmented portals (MahaDBT, Aaple Sarkar, MJPJAY), language barriers, and uncertainty about eligibility or documentation. SAHAY AI solves this with:
- **Natural Language Dialogue in 3 Languages:** Fluently understands and responds in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.
- **Source-Grounded Retrieval-Augmented Generation (RAG):** Every factual response is anchored in official Government Resolutions (GRs) and verified department portals with direct source citations.
- **Strict Anti-Hallucination Guardrails:** If a scheme or benefit cannot be verified from authentic records, the AI explicitly communicates uncertainty rather than guessing.
- **Interactive Guided Eligibility Checker:** Non-invasive evaluation against structured rules (age, gender, income, caste category, occupation, domicile) without asking for Aadhaar, PAN, or OTPs.
- **Dynamic Document Checklist Generator:** Step-by-step checklist with plain-language explanations of why each document is required.
- **Administrative Portal:** Secure interface for government curators to update schemes, review verification dates, and re-index the knowledge base.

---

## 🌟 Key Application Features

| Feature | Description |
| :--- | :--- |
| **Multilingual AI Assistant** | Conversational chat interface with streaming responses, starter prompts, copy text, speech read-aloud (Web Speech API), and source citations. |
| **Scheme Explorer** | Searchable catalog of verified Maharashtra welfare schemes with category filtering (Agriculture, Education, Healthcare, Women & Child, Social Welfare, Housing). |
| **Scheme Detail Intelligence** | Full transparency: plain-language explanation, department, structured eligibility criteria, financial benefits, required documents, and official application links. |
| **Guided Eligibility Engine** | Instant evaluation indicating **Eligible**, **Conditionally Eligible**, or **Ineligible** with itemized satisfied and unmet criteria. |
| **Interactive Document Checklist** | Interactive checkboxes allowing citizens to track document readiness (e.g., "3 of 5 Ready") before visiting Setu / CSC centers. |
| **Administrative Control Center** | Protected portal with passkey authentication (`x-admin-token`), live re-indexing trigger, audit logs, and citizen feedback review. |
| **Trust & Privacy Pledge** | Zero storage of Aadhaar, PAN, or bank credentials. Grounded exclusively in verified Maharashtra Government Resolutions. |

---

## 📋 Verified Maharashtra Welfare Schemes Included

1. **Mukhyamantri Majhi Ladki Bahin Yojana** — Women & Child Development (₹1,500/month direct bank transfer for women aged 21-65).
2. **Namo Shetkari Mahasanman Nidhi Yojana** — Agriculture Department (₹6,000/year state assistance supplementing PM-KISAN to total ₹12,000/year).
3. **Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)** — Public Health (₹5,00,000/year cashless hospitalization across 1,356 procedures).
4. **Rajarshi Chhatrapati Shahu Maharaj Shikshan Shulkh Shishyavrutti Yojna** — Higher & Technical Education (50% tuition and exam fee reimbursement via MahaDBT).
5. **Dr. Babasaheb Ambedkar Swadhar Yojana** — Social Justice (₹48,000 to ₹60,000/year hostel and food allowance for SC/Neo-Buddhist students).
6. **Sanjay Gandhi Niradhar Anudan Yojana** — Social Assistance / Revenue Department (₹1,500/month pension for destitute, widows, and persons with disabilities).
7. **Mukhyamantri Baliraja Vij Savalat Yojana** — Energy Department & MSEDCL (100% free electricity subsidy for agricultural pumps up to 7.5 HP).
8. **Shabari Adivasi Gharkul Yojana** — Tribal Development (₹1.20L to ₹1.50L grant for pucca house construction for ST families).
9. **Ramai Awas Yojana** — Social Justice (₹1.20L to ₹2.50L housing grant for SC and Nav-Buddha families).
10. **Maharashtra Student Bus Concession Scheme (MSRTC)** — Transport Department (Up to 66.7% student concession; 100% free bus travel for schoolgirls under Ahilyabai Holkar Scheme).

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS v4, Lucide React Icons.
- **Backend:** Node.js (v20+ / v26), Express, TypeScript, Better-SQLite3 with WAL mode.
- **RAG & AI Engine:**
  - Hybrid lexical BM25 token weighting + cosine similarity vector retrieval.
  - Multi-provider AI Adapter: Google Gemini API (`GEMINI_API_KEY`), OpenAI API (`OPENAI_API_KEY`), or built-in **Deterministic Local Grounded Reasoning Engine** (runs out-of-the-box with zero API keys required).
  - Trilingual Intent Classifier: handles Marathi, Hindi, and English grammar and scripts.

---

## 🚀 Quickstart & Installation

### 1. Prerequisites
- **Node.js:** v20.0.0 or higher (v26 verified).
- **npm:** v10 or higher.

### 2. Clone and Install Dependencies
From the project root:
```bash
# Install root orchestration tools
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
cd ..
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Default contents:
```env
PORT=5000
NODE_ENV=development
ADMIN_TOKEN=sahay-admin-secret-2026
DB_PATH=./sahay.sqlite
CORS_ORIGIN=*

# Optional external LLMs (if blank, built-in Local Grounded AI Engine is used)
GEMINI_API_KEY=
OPENAI_API_KEY=
```

### 4. Seed the Database
Initialize and populate the 10 verified Maharashtra schemes, eligibility rules, documents, and RAG chunks:
```bash
npm run seed
```

### 5. Start the Application
Run both backend and frontend concurrently with one command:
```bash
npm run dev
```

- **Frontend Application:** [http://localhost:3000](http://localhost:3000)
- **Backend REST API:** [http://localhost:5000](http://localhost:5000)
- **Backend Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🧪 Automated Testing

SAHAY AI includes an automated end-to-end test suite covering all 8 criteria of Phase 11:
1. **Multilingual Awareness:** Validates queries in English, Marathi, and Hindi, verifying that amounts and terms are preserved.
2. **Scheme Discovery:** Verifies retrieval for citizen needs (e.g. "Find schemes for students in Maharashtra").
3. **Structured Eligibility:** Tests positive profile match and underage rejection.
4. **Document Grounding:** Verifies documents are sourced from official records (e.g., MJPJAY requiring Ration Card).
5. **Official Links & Citations:** Verifies all 10 schemes have valid HTTPS portals and official Government Resolutions.
6. **Strict Anti-Hallucination:** Verifies that queries for non-existent schemes trigger honest uncertainty statements.
7. **Boundary Handling:** Tests empty strings, single characters, and malformed inputs.

Run tests:
```bash
npm test
```

---

## 🔒 Security, Privacy & Smart Governance

1. **Zero Sensitive Identifier Storage:** No Aadhaar numbers, PAN cards, bank account numbers, or OTPs are requested or saved.
2. **Protected Administration:** Administrative operations (re-indexing, scheme updates) require authorization via `x-admin-token`.
3. **No External Dependency Lock-in:** The local grounded reasoning engine guarantees that the platform functions autonomously and reliably without requiring continuous paid cloud API tokens.
4. **Source Attribution:** Every response displays the originating Government Resolution and official verification date.

---

## 📄 License & Challenge Acknowledgement
Developed for the **Seva First Innovation Challenge Maharashtra 2026**. Dedicated to public service excellence, transparency, and inclusive smart governance for the citizens of Maharashtra.

