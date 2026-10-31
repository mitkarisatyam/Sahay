import React, { useState, useEffect } from 'react';
import { Scheme, LanguageCode } from '../types';
import { fetchDocumentChecklist } from '../services/api';
import { CheckSquare, Square, Printer, FileText, ExternalLink, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface ChecklistPageProps {
  schemes: Scheme[];
  language: LanguageCode;
  selectedSchemeId?: string;
  onSelectSchemeId: (id: string) => void;
}

export const ChecklistPage: React.FC<ChecklistPageProps> = ({
  schemes,
  language,
  selectedSchemeId,
  onSelectSchemeId
}) => {
  const [currentId, setCurrentId] = useState<string>(selectedSchemeId || (schemes[0]?.id ?? 'ladki-bahin-yojana'));
  const [data, setData] = useState<any>(null);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSchemeId) {
      setCurrentId(selectedSchemeId);
    }
  }, [selectedSchemeId]);

  useEffect(() => {
    if (currentId) {
      loadChecklist(currentId);
    }
  }, [currentId, language]);

  const loadChecklist = async (schemeId: string) => {
    setLoading(true);
    try {
      const res = await fetchDocumentChecklist(schemeId, language);
      setData(res);
      setCheckedDocs({});
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedDocs(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const preparedCount = Object.values(checkedDocs).filter(Boolean).length;
  const totalCount = data?.checklist?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((preparedCount / totalCount) * 100) : 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#167D83] text-xs font-semibold border border-teal-200 mb-2">
            <FileText className="w-3.5 h-3.5" />
            <span>Interactive Application Prep</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'mr' ? 'कागदपत्रे तपासणी व तयारी सूची' : language === 'hi' ? 'दस्तावेज चेकलिस्ट एवं तैयारी' : 'Government Scheme Document Checklist'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {language === 'mr'
              ? 'अर्ज करण्यापूर्वी आवश्यक असणारी कागदपत्रे तपासा व अर्जाची पूर्वतयारी करा.'
              : language === 'hi'
              ? 'आवेदन करने से पूर्व सभी अनिवार्य दस्तावेजों की जांच करें व तैयारी सुनिश्चित करें।'
              : 'Prepare and verify all mandatory documents before applying to prevent rejection at Setu / CSC centers.'}
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1.5 transition-colors cursor-pointer shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Print Checklist</span>
        </button>
      </div>

      {/* Scheme Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          Select Welfare Scheme:
        </label>
        <select
          value={currentId}
          onChange={(e) => {
            setCurrentId(e.target.value);
            onSelectSchemeId(e.target.value);
          }}
          className="w-full px-4 py-3 bg-[#F7F8F5] border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:border-teal-500"
        >
          {schemes.map((s) => (
            <option key={s.id} value={s.id}>
              {language === 'mr' ? s.name_mr : language === 'hi' ? s.name_hi : s.name_en} ({s.category})
            </option>
          ))}
        </select>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="text-center py-12 text-slate-500 text-xs">
          Loading official document requirements...
        </div>
      )}

      {/* Checklist Content */}
      {data && !loading && (
        <div className="space-y-6">
          {/* Scheme Info Card & Progress Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">{data.scheme_name}</h2>
                <p className="text-xs text-slate-500">{data.department}</p>
              </div>
              <a
                href={data.official_portal_url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 bg-teal-50 text-[#167D83] border border-teal-200 rounded-lg text-xs font-semibold flex items-center space-x-1 hover:bg-teal-100 transition-colors"
              >
                <span>Official Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Preparation Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-700">
                  Document Readiness: {preparedCount} of {totalCount} Ready
                </span>
                <span className={`${progressPercent === 100 ? 'text-emerald-600' : 'text-teal-700'}`}>
                  {progressPercent}% Complete
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    progressPercent === 100 ? 'bg-emerald-500' : 'bg-[#167D83]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Interactive Checklist Items */}
          <div className="space-y-3">
            {data.checklist.map((item: any) => {
              const isChecked = !!checkedDocs[item.id];

              return (
                <div
                  key={item.id}
                  onClick={() => toggleCheck(item.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-4 ${
                    isChecked
                      ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="pt-0.5 shrink-0 text-slate-400">
                    {isChecked ? (
                      <CheckSquare className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-slate-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Step {item.step}.</span>
                      <h3 className={`text-sm font-bold ${isChecked ? 'line-through text-slate-600' : 'text-slate-900'}`}>
                        {item.document_name}
                      </h3>
                      {item.is_mandatory ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-100 text-rose-800 border border-rose-200">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          Optional
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600">
                      <strong>Purpose:</strong> {item.purpose}
                    </p>

                    {item.alternative_documents && (
                      <p className="text-[11px] text-amber-700 bg-amber-50/70 p-1.5 rounded-md border border-amber-200/50 mt-1">
                        Alternative Allowed: {item.alternative_documents}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400 italic">
                      Tip: {item.tip}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Verification Source Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Grounded in: {data.source?.name}</span>
            </span>
            <span>Verified: {data.source?.verified_date}</span>
          </div>
        </div>
      )}
    </div>
  );
};

