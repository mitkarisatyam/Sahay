# SAHAY AI — Production Deployment Guide
**Seva First Innovation Challenge Maharashtra 2026**  
**Problem Statement 9.1: AI-Powered Citizen Services and Smart Governance**

---

## 1. Overview
SAHAY AI is built with a decoupled modern architecture:
- **Backend:** Node.js (v20+) with Express, TypeScript, Better-SQLite3, and a high-performance RAG pipeline.
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS.

---

## 2. Production Build

Run from project root:
```bash
npm run build
```
This executes:
1. `backend/`: TypeScript compilation to JavaScript (`backend/dist`).
2. `frontend/`: Vite production bundle output to `frontend/dist`.

---

## 3. Deployment Options

### Option A: Single-Host Node.js + PM2 (Recommended for State Data Centers)

1. **Clone and Install:**
   ```bash
   git clone <repo-url>
   cd "Sahay Ai"
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure Environment:**
   ```bash
   cp .env.example .env
   # Edit .env with production PORT and optional GEMINI_API_KEY
   ```

3. **Seed SQLite Database:**
   ```bash
   npm run seed
   ```

4. **Build Frontend & Backend:**
   ```bash
   npm run build
   ```

5. **Serve via Reverse Proxy (Nginx) or Express Static:**
   Point Nginx `/` to `frontend/dist` and proxy `/api` to `http://localhost:5000`.

   Sample Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name sahay.maharashtra.gov.in;

       location / {
           root /var/www/sahay-ai/frontend/dist;
           try_files $uri $uri/ /index.html;
       }

       location /api {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

6. **Start with PM2:**
   ```bash
   pm2 start backend/dist/server.js --name "sahay-ai-api"
   pm2 save
   pm2 startup
   ```

---

### Option B: Docker Containerization

Create `Dockerfile`:
```dockerfile
FROM node:22-alpine AS build

WORKDIR /app
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN cd backend && npm install
RUN cd frontend && npm install

COPY . .
RUN npm run build
RUN cd backend && npm run seed

EXPOSE 5000
CMD ["node", "backend/dist/server.js"]
```

Build and run:
```bash
docker build -t sahay-ai:1.0 .
docker run -d -p 5000:5000 --env-file .env --name sahay-ai sahay-ai:1.0
```

---

## 4. Monitoring & Health Check

The application exposes a production health probe:
```http
GET /api/health
```

Sample 200 OK Response:
```json
{
  "status": "healthy",
  "app": "SAHAY AI — Citizen Services Platform",
  "version": "1.0.0",
  "database": {
    "connected": true,
    "active_schemes": 10,
    "indexed_chunks": 16
  },
  "ai_providers": {
    "gemini_configured": false,
    "openai_configured": false,
    "local_grounded_active": true
  },
  "supported_languages": ["en", "mr", "hi"]
}
```

---

## 5. Security & Privacy Hardening
- **Strict HTTPS:** Always deploy behind SSL/TLS (Let's Encrypt or Gov CA).
- **Admin Passkey:** Change `ADMIN_TOKEN` in `.env` to a secure 32-character random string.
- **Zero Sensitive Data:** By policy and design, no Aadhaar, PAN, or financial credentials are ever stored.

