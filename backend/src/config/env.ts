import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from backend root or workspace root
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config();

const defaultDbPath = process.env.VERCEL
  ? path.join('/tmp', 'sahay.sqlite')
  : path.resolve(__dirname, '../../sahay.sqlite');

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ADMIN_TOKEN: process.env.ADMIN_TOKEN || 'sahay-admin-secret-2026',
  DB_PATH: process.env.DB_PATH || defaultDbPath,
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

