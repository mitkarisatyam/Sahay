import React, { useState } from 'react';
import { EligibilityResult, LanguageCode } from '../types';
import { evaluateEligibility } from '../services/api';
import { UserCheck, CheckCircle2, AlertTriangle, XCircle, ArrowRight, ShieldAlert, Sparkles, ExternalLink } from 'lucide-react';

interface EligibilityPageProps {
  language: LanguageCode;
  onOpenSchemeModal: (schemeId: string) => void;
  onOpenChecklist: (schemeId: string) => void;
}

export const EligibilityPage: React.FC<EligibilityPageProps> = ({
  language,
  onOpenSchemeModal,
  onOpenChecklist
}) => {
  const [age, setAge] = useState<number | ''>(28);
  const [gender, setGender] = useState<string>('Female');
  const [caste, setCaste] = useState<string>('General');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(180000);
  const [occupation, setOccupation] = useState<string>('Homemaker');
  const [isMaharashtraResident, setIsMaharashtraResident] = useState<boolean>(true);
  const [hasSpecialDisability, setHasSpecialDisability] = useState<boolean>(false);
  const [isWidowOrDeserted, setIsWidowOrDeserted] = useState<boolean>(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<EligibilityResult[] | null>(null);
  const [disclaimer, setDisclaimer] = useState<string>('');

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await evaluateEligibility({
        age: age !== '' ? Number(age) : undefined,
        gender,
        caste,
        annualIncome: annualIncome !== '' ? Number(annualIncome) : undefined,
        occupation,
        isMaharashtraResident,
        hasSpecialDisability,
        isWidowOrDeserted,
        language
      });

      setResults(response.results);
      setDisclaimer(response.disclaimer);
    } catch (err: any) {
      alert(`Evaluation error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-teal-50 text-[#167D83] text-xs font-semibold border border-teal-200 mb-2">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Non-Invasive Citizen Profiler</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'mr' ? 'शासकीय योजना पात्रता चाचणी' : language === 'hi' ? 'सरकारी योजना पात्रता जांच' : 'Guided Welfare Scheme Eligibility Checker'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
          {language === 'mr'
            ? 'आपली सामान्य माहिती भरा आणि आपण कोणत्या योजनांसाठी पात्र आहात ते त्वरित जाणून घ्या. आम्ही आधार किंवा बँक माहिती मागत नाही.'
            : language === 'hi'
            ? 'अपनी सामान्य जानकारी भरें और जानें कि आप किन योजनाओं के लिए पात्र हैं। हम आधार अथवा बैंक विवरण नहीं मांगते।'
            : 'Fill in basic non-sensitive criteria to find out which Maharashtra government welfare schemes match your profile.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-teal-800">
            Citizen Profile Parameters
          </h2>

          <form onSubmit={handleCheck} className="space-y-4 text-xs">
            {/* Age */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Age (in years) / वय (वर्षे)
              </label>
              <input
                type="number"
                min="0"
                max="110"
                value={age}
                onChange={(e) => setAge(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-[#F7F8F5] border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
                required
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Gender / लिंग
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8F5] border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="Female">Female (महिला)</option>
                <option value="Male">Male (पुरुष)</option>
                <option value="Transgender">Transgender (तृतीयपंथी)</option>
              </select>
            </div>

            {/* Caste / Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Social Category / सामाजिक प्रवर्ग
              </label>
              <select
                value={caste}
                onChange={(e) => setCaste(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8F5] border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="General">General / Open (खुला प्रवर्ग)</option>
                <option value="EWS">EWS (आर्थिक दुर्बल घटक)</option>
                <option value="SEBC">SEBC (सामाजिक व शैक्षणिक मागास)</option>
                <option value="OBC">OBC (इतर मागासवर्ग)</option>
                <option value="SC">SC (अनुसूचित जाती)</option>
                <option value="Neo-Buddhist">Neo-Buddhist (नवबौद्ध)</option>
                <option value="ST">ST (अनुसूचित जमाती)</option>
              </select>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Annual Family Income (INR) / वार्षिक कौटुंबिक उत्पन्न
              </label>
              <input
                type="number"
                step="5000"
                value={annualIncome}
                onChange={(e) => setAnnualIncome(e.target.value ? Number(e.target.value) : '')}
                className="w-full px-3 py-2 bg-[#F7F8F5] border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
                placeholder="e.g. 150000"
                required
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                As per Tahsildar income certificate or ration card tier.
              </span>
            </div>

            {/* Occupation */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Occupation / Status / व्यवसाय
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2 bg-[#F7F8F5] border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-teal-500"
              >
                <option value="Homemaker">Homemaker (गृहिणी)</option>
                <option value="Farmer">Farmer (शेतकरी - शेतीजमीन धारक)</option>
                <option value="Student">Student (विद्यार्थी - उच्च शिक्षण/शाळा)</option>
                <option value="Destitute">Destitute / No fixed income (निराधार)</option>
                <option value="Employed">Salaried / Private Employee</option>
                <option value="Unemployed">Self-employed / Unemployed</option>
              </select>
            </div>

            {/* Maharashtra Domicile */}
            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isMaharashtraResident}
                  onChange={(e) => setIsMaharashtraResident(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="font-semibold text-slate-700">
                  Continuous resident of Maharashtra (Domicile)
                </span>
              </label>
            </div>

            {/* Special Conditions */}
            <div className="space-y-1.5 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSpecialDisability}
                  onChange={(e) => setHasSpecialDisability(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-600">
                  Person with benchmark disability (40%+ certified)
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isWidowOrDeserted}
                  onChange={(e) => setIsWidowOrDeserted(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <span className="text-slate-600">
                  Widow, divorced, or deserted woman
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#167D83] hover:bg-[#13666b] text-white font-semibold rounded-xl text-xs transition-colors shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Rules...' : 'Check My Eligibility'}</span>
            </button>
          </form>

          {/* Privacy Note */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Zero Storage Policy:</strong> Your demographic inputs are processed ephemerally to match criteria and are not saved to any profile.
            </span>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wider text-teal-800">
              Evaluated Welfare Schemes
            </h2>
            {results && (
              <span className="text-xs text-slate-500">
                {results.filter(r => r.status === 'Eligible').length} Eligible • {results.filter(r => r.status === 'Conditionally Eligible').length} Needs Verification
              </span>
            )}
          </div>

          {results ? (
            <div className="space-y-4">
              {results.map((res) => {
                const isEligible = res.status === 'Eligible';
                const isConditional = res.status === 'Conditionally Eligible';

                return (
                  <div
                    key={res.scheme_id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                      isEligible
                        ? 'border-emerald-300 ring-1 ring-emerald-100'
                        : isConditional
                        ? 'border-amber-300 ring-1 ring-amber-100'
                        : 'border-slate-200 opacity-75'
                    }`}
                  >
                    {/* Status Badge & Category */}
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-slate-500">
                        {res.category}
                      </span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                          isEligible
                            ? 'bg-emerald-100 text-emerald-800'
                            : isConditional
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {isEligible ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isConditional ? (
                          <AlertTriangle className="w-3.5 h-3.5" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5" />
                        )}
                        <span>{res.status}</span>
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-2">
                      {res.scheme_name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">{res.department}</p>

                    {/* Benefit summary */}
                    <div className="mt-2.5 p-2.5 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium border border-slate-200">
                      <span className="text-teal-700 font-semibold block text-[11px]">
                        Benefit:
                      </span>
                      {res.benefits_summary}
                    </div>

                    {/* Conditions Breakdown */}
                    <div className="mt-3 space-y-1.5 text-xs">
                      {res.satisfied_conditions.map((sc, i) => (
                        <div key={i} className="flex items-start space-x-2 text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{sc}</span>
                        </div>
                      ))}

                      {res.unmet_conditions.map((uc, i) => (
                        <div key={i} className="flex items-start space-x-2 text-rose-700 font-medium">
                          <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{uc}</span>
                        </div>
                      ))}

                      {res.pending_verifications.map((pv, i) => (
                        <div key={i} className="flex items-start space-x-2 text-amber-700">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{pv}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => onOpenSchemeModal(res.scheme_id)}
                          className="font-semibold text-[#167D83] hover:underline cursor-pointer"
                        >
                          View Scheme Rules
                        </button>
                        <button
                          onClick={() => onOpenChecklist(res.scheme_id)}
                          className="font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Document Checklist ({res.required_documents.length})
                        </button>
                      </div>

                      <a
                        href={res.official_portal_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-500 hover:text-slate-800 flex items-center space-x-1"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                );
              })}

              {disclaimer && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                  {disclaimer}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <UserCheck className="w-10 h-10 text-teal-600 mx-auto" />
              <h3 className="text-base font-semibold text-slate-800">
                Ready to assess your eligibility
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Adjust your profile parameters on the left and click "Check My Eligibility" to evaluate against all 10 verified welfare schemes.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

