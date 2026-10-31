import { Scheme, ChatMessage, EligibilityResult, LanguageCode } from '../types';

const API_BASE = '/api';

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function sendChatMessage(message: string, language: LanguageCode, sessionId?: string): Promise<{
  sessionId: string;
  messageId: string;
  answer: string;
  language: LanguageCode;
  related_schemes: any[];
  eligibility_guidance: string[];
  document_checklist: any[];
  sources: any[];
  disclaimer: string;
  provider: string;
}> {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, language, sessionId })
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to send message');
  }

  return res.json();
}

export async function fetchChatHistory(sessionId: string): Promise<ChatMessage[]> {
  const res = await fetch(`${API_BASE}/chat/history/${sessionId}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.messages || [];
}

export async function fetchSchemes(category?: string, search?: string): Promise<Scheme[]> {
  const params = new URLSearchParams();
  if (category && category !== 'All') params.append('category', category);
  if (search && search.trim()) params.append('search', search.trim());

  const res = await fetch(`${API_BASE}/schemes?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch schemes');
  const data = await res.json();
  return data.schemes || [];
}

export async function fetchSchemeDetail(id: string): Promise<Scheme> {
  const res = await fetch(`${API_BASE}/schemes/${id}`);
  if (!res.ok) throw new Error('Failed to fetch scheme detail');
  return res.json();
}

export async function evaluateEligibility(profile: {
  age?: number;
  gender?: string;
  caste?: string;
  annualIncome?: number;
  occupation?: string;
  isMaharashtraResident?: boolean;
  hasSpecialDisability?: boolean;
  isWidowOrDeserted?: boolean;
  language?: LanguageCode;
}): Promise<{
  results: EligibilityResult[];
  disclaimer: string;
}> {
  const res = await fetch(`${API_BASE}/eligibility/check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile)
  });

  if (!res.ok) throw new Error('Eligibility check failed');
  return res.json();
}

export async function fetchDocumentChecklist(schemeId: string, language: LanguageCode) {
  const res = await fetch(`${API_BASE}/documents/checklist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ schemeId, language })
  });

  if (!res.ok) throw new Error('Checklist retrieval failed');
  return res.json();
}

export async function submitFeedback(data: {
  sessionId?: string;
  messageId?: string;
  schemeId?: string;
  rating: number;
  comment?: string;
}) {
  const res = await fetch(`${API_BASE}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function adminReindex(adminToken: string) {
  const res = await fetch(`${API_BASE}/admin/reindex`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': adminToken
    }
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Reindex failed');
  }
  return res.json();
}

export async function fetchAdminAuditLogs(adminToken: string) {
  const res = await fetch(`${API_BASE}/admin/audit-logs`, {
    headers: { 'x-admin-token': adminToken }
  });
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchAdminFeedback(adminToken: string) {
  const res = await fetch(`${API_BASE}/admin/feedback`, {
    headers: { 'x-admin-token': adminToken }
  });
  if (!res.ok) throw new Error('Failed to fetch feedback');
  return res.json();
}

