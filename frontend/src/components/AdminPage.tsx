import React, { useState, useEffect } from 'react';
import { Scheme, LanguageCode } from '../types';
import { adminReindex, fetchAdminAuditLogs, fetchAdminFeedback } from '../services/api';
import { Settings, Lock, RefreshCw, CheckCircle, AlertCircle, Database, MessageSquare, History, ShieldAlert } from 'lucide-react';

interface AdminPageProps {
  schemes: Scheme[];
  language: LanguageCode;
  onRefreshSchemes: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  schemes,
  language,
  onRefreshSchemes
}) => {
  const [tokenInput, setTokenInput] = useState('');
  const [adminToken, setAdminToken] = useState<string>(localStorage.getItem('sahay_admin_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [reindexing, setReindexing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [feedbackLogs, setFeedbackLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'schemes' | 'audit' | 'feedback'>('schemes');

  useEffect(() => {
    if (adminToken) {
      loadAdminData(adminToken);
    }
  }, [adminToken]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (tokenInput.trim()) {
      setAdminToken(tokenInput.trim());
      localStorage.setItem('sahay_admin_token', tokenInput.trim());
      loadAdminData(tokenInput.trim());
    }
  };

  const handleLogout = () => {
    setAdminToken('');
    localStorage.removeItem('sahay_admin_token');
    setIsAuthenticated(false);
  };

  const loadAdminData = async (tok: string) => {
    try {
      const [logs, fb] = await Promise.all([
        fetchAdminAuditLogs(tok),
        fetchAdminFeedback(tok)
      ]);
      setAuditLogs(logs.logs || []);
      setFeedbackLogs(fb.feedback || []);
      setIsAuthenticated(true);
      setStatusMessage(null);
    } catch (err: any) {
      setIsAuthenticated(false);
      setStatusMessage('Authentication failed: Invalid admin passkey.');
    }
  };

  const handleTriggerReindex = async () => {
    setReindexing(true);
    setStatusMessage(null);
    try {
      const res = await adminReindex(adminToken);
      setStatusMessage(`Success: ${res.message}`);
      onRefreshSchemes();
      loadAdminData(adminToken);
    } catch (err: any) {
      setStatusMessage(`Reindex error: ${err.message}`);
    } finally {
      setReindexing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl bg-[#14263D] text-teal-400 flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Administrator Portal</h2>
            <p className="text-xs text-slate-500 mt-1">
              Protected interface for government department curators and database ingestion admins.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="Enter Admin Token (default: sahay-admin-secret-2026)"
                className="w-full px-4 py-2.5 bg-[#F7F8F5] border border-slate-300 rounded-xl text-sm focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            {statusMessage && (
              <p className="text-xs text-rose-600 font-medium">{statusMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#167D83] hover:bg-[#13666b] text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Authenticate Admin
            </button>
          </form>

          <p className="text-[11px] text-slate-400">
            For local evaluation, use default: <code className="bg-slate-100 px-1 py-0.5 rounded">sahay-admin-secret-2026</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
            <Settings className="w-3.5 h-3.5 text-teal-600" />
            <span>Authorized Administration Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Knowledge Base & Scheme Management
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleTriggerReindex}
            disabled={reindexing}
            className="px-4 py-2 bg-[#167D83] hover:bg-[#13666b] text-white rounded-xl text-xs font-semibold flex items-center space-x-2 transition-colors shadow-xs cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${reindexing ? 'animate-spin' : ''}`} />
            <span>{reindexing ? 'Re-Indexing Database...' : 'Re-Index Knowledge Base'}</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
          >
            Logout
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('schemes')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'schemes'
              ? 'border-[#167D83] text-[#167D83]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <Database className="w-4 h-4" />
            <span>Indexed Schemes ({schemes.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'audit'
              ? 'border-[#167D83] text-[#167D83]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <History className="w-4 h-4" />
            <span>Audit Trail ({auditLogs.length})</span>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`pb-3 px-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-[#167D83] text-[#167D83]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center space-x-1.5">
            <MessageSquare className="w-4 h-4" />
            <span>Citizen Feedback ({feedbackLogs.length})</span>
          </div>
        </button>
      </div>

      {/* Tab 1: Schemes List */}
      {activeTab === 'schemes' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-[#F7F8F5] text-slate-500 border-b border-slate-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5 font-bold">Scheme ID & Name</th>
                  <th className="p-3.5 font-bold">Department</th>
                  <th className="p-3.5 font-bold">Category</th>
                  <th className="p-3.5 font-bold">Source Reference</th>
                  <th className="p-3.5 font-bold">Verified Date</th>
                  <th className="p-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {schemes.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900">{s.name_en}</div>
                      <div className="text-[11px] text-slate-500">{s.name_mr}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 max-w-xs truncate">{s.department}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium text-[10px]">
                        {s.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-600">{s.source_name}</td>
                    <td className="p-3.5 text-slate-500 whitespace-nowrap">{s.source_verified_date}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Trail */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-3">
          {auditLogs.length > 0 ? (
            <div className="space-y-3 text-xs">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-start">
                  <div>
                    <span className="font-bold text-slate-900 block">{log.action}</span>
                    <span className="text-slate-600">{log.details}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 whitespace-nowrap ml-4">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No audit logs recorded yet.</p>
          )}
        </div>
      )}

      {/* Tab 3: Citizen Feedback */}
      {activeTab === 'feedback' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-5 space-y-3">
          {feedbackLogs.length > 0 ? (
            <div className="space-y-3 text-xs">
              {feedbackLogs.map((fb) => (
                <div key={fb.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-slate-800">
                      Rating: {fb.rating > 0 ? '👍 Positive' : fb.rating < 0 ? '👎 Negative' : 'Neutral'}
                    </span>
                    {fb.comment && <p className="text-slate-600 mt-1">{fb.comment}</p>}
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(fb.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500">No citizen feedback recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

