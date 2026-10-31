import React from 'react';
import { Scheme, LanguageCode } from '../types';
import { X, ExternalLink, CheckCircle, FileText, Calendar, Building2, HelpCircle } from 'lucide-react';

interface SchemeDetailModalProps {
  scheme: Scheme | null;
  language: LanguageCode;
  onClose: () => void;
  onOpenChecklist: (schemeId: string) => void;
}

export const SchemeDetailModal: React.FC<SchemeDetailModalProps> = ({
  scheme,
  language,
  onClose,
  onOpenChecklist
}) => {
  if (!scheme) return null;

  const schemeName = language === 'mr' ? scheme.name_mr : language === 'hi' ? scheme.name_hi : scheme.name_en;
  const schemeDesc = language === 'mr' ? scheme.description_mr : language === 'hi' ? scheme.description_hi : scheme.description_en;
  const additionalCond = language === 'mr' ? scheme.criteria?.additional_conditions_mr : language === 'hi' ? scheme.criteria?.additional_conditions_hi : scheme.criteria?.additional_conditions_en;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-[#14263D] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30 mb-2">
            {scheme.category}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold pr-8 leading-snug">
            {schemeName}
          </h2>
          <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs text-slate-300">
            <span className="flex items-center space-x-1">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{scheme.department}</span>
            </span>
            <span className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Verified: {scheme.source_verified_date}</span>
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800 text-sm">
          {/* Summary */}
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-2">
              {language === 'mr' ? 'योजनेचा तपशील' : language === 'hi' ? 'योजना का विवरण' : 'Scheme Overview'}
            </h3>
            <p className="text-slate-600 leading-relaxed bg-[#F7F8F5] p-3.5 rounded-lg border border-slate-200">
              {schemeDesc}
            </p>
          </div>

          {/* Benefits Box */}
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4">
            <h4 className="font-semibold text-[#167D83] text-sm mb-1">
              {language === 'mr' ? 'शासकीय लाभ व स्वरूप' : language === 'hi' ? 'सरकारी लाभ एवं स्वरूप' : 'Key Scheme Benefits'}
            </h4>
            <p className="text-teal-900 font-medium text-base">
              {scheme.benefits_summary}
            </p>
            {scheme.max_benefit_amount && (
              <span className="inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded bg-teal-200/60 text-teal-900">
                Max Amount: {scheme.max_benefit_amount}
              </span>
            )}
          </div>

          {/* Eligibility Criteria */}
          <div>
            <h3 className="font-semibold text-slate-900 text-base mb-3">
              {language === 'mr' ? 'पात्रता अटी व निकष' : language === 'hi' ? 'पात्रता शर्तें एवं नियम' : 'Eligibility Criteria'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {scheme.criteria?.min_age || scheme.criteria?.max_age ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Age Limit</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    {scheme.criteria.min_age ? `${scheme.criteria.min_age} yrs` : 'No min'} - {scheme.criteria.max_age ? `${scheme.criteria.max_age} yrs` : 'No max'}
                  </span>
                </div>
              ) : null}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium block">Gender</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {scheme.criteria?.gender || 'All'}
                </span>
              </div>

              {scheme.criteria?.max_income ? (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 font-medium block">Max Annual Income</span>
                  <span className="font-semibold text-slate-800 text-sm">
                    ₹{scheme.criteria.max_income.toLocaleString('en-IN')}
                  </span>
                </div>
              ) : null}

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="text-slate-500 font-medium block">Target Beneficiaries</span>
                <span className="font-semibold text-slate-800 text-sm">
                  {scheme.target_beneficiaries}
                </span>
              </div>
            </div>

            {additionalCond && (
              <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-900 text-xs flex items-start space-x-2">
                <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block mb-0.5">Special Conditions:</span>
                  <span>{additionalCond}</span>
                </div>
              </div>
            )}
          </div>

          {/* Required Documents */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-base">
                {language === 'mr' ? 'आवश्यक कागदपत्रे' : language === 'hi' ? 'आवश्यक दस्तावेज' : 'Required Documents'}
              </h3>
              <button
                onClick={() => {
                  onClose();
                  onOpenChecklist(scheme.id);
                }}
                className="text-xs text-[#167D83] font-semibold hover:underline flex items-center space-x-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Interactive Checklist</span>
              </button>
            </div>

            <div className="space-y-2">
              {scheme.documents && scheme.documents.length > 0 ? (
                scheme.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 rounded-lg border border-slate-200 bg-white flex items-start space-x-3">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-medium text-slate-900 text-xs">
                        {language === 'mr' ? doc.document_name_mr : language === 'hi' ? doc.document_name_hi : doc.document_name_en}
                      </span>
                      {doc.is_mandatory && (
                        <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-rose-100 text-rose-700 font-medium">
                          Mandatory
                        </span>
                      )}
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {language === 'mr' ? doc.purpose_mr : language === 'hi' ? doc.purpose_hi : doc.purpose_en}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500">No specific document list indexed for this scheme.</p>
              )}
            </div>
          </div>

          {/* Application Procedure & Official Links */}
          <div className="p-4 bg-slate-100 rounded-xl space-y-2">
            <h4 className="font-semibold text-slate-900 text-xs uppercase tracking-wider">
              {language === 'mr' ? 'अर्ज कसा करावा?' : language === 'hi' ? 'आवेदन कैसे करें?' : 'Application Process'}
            </h4>
            <p className="text-xs text-slate-700">
              <span className="font-medium">Application Mode:</span> {scheme.application_mode}
            </p>
            <p className="text-xs text-slate-600">
              <span className="font-medium">Verified Source:</span> {scheme.source_name}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-slate-500">
            Source Grounded: {scheme.source_verified_date}
          </span>
          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors w-full sm:w-auto"
            >
              Close
            </button>
            <a
              href={scheme.official_portal_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#167D83] hover:bg-[#13666b] text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors shadow-sm w-full sm:w-auto"
            >
              <span>Visit Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

