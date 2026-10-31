import React, { useState } from 'react';
import { Scheme, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { Search, Bot, ArrowRight, ShieldCheck, FileCheck, CheckCircle2, Users, Sparkles, Building2, ExternalLink } from 'lucide-react';

interface HomePageProps {
  schemes: Scheme[];
  language: LanguageCode;
  onNavigate: (tab: string, initialQuery?: string, categoryFilter?: string) => void;
  onSelectScheme: (scheme: Scheme) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  schemes,
  language,
  onNavigate,
  onSelectScheme
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const t = UI_TRANSLATIONS[language];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('chat', searchQuery.trim());
    } else {
      onNavigate('chat');
    }
  };

  const categories = [
    { id: 'cat_women', name: t.cat_women, filter: 'Women & Child Development', count: 1, icon: Users, color: 'from-pink-500/10 to-rose-500/10 text-rose-700' },
    { id: 'cat_agriculture', name: t.cat_agriculture, filter: 'Agriculture', count: 2, icon: Sparkles, color: 'from-amber-500/10 to-emerald-500/10 text-emerald-700' },
    { id: 'cat_healthcare', name: t.cat_healthcare, filter: 'Healthcare', count: 1, icon: ShieldCheck, color: 'from-blue-500/10 to-teal-500/10 text-teal-700' },
    { id: 'cat_education', name: t.cat_education, filter: 'Education', count: 2, icon: FileCheck, color: 'from-indigo-500/10 to-blue-500/10 text-indigo-700' },
    { id: 'cat_social', name: t.cat_social, filter: 'Social Welfare', count: 2, icon: CheckCircle2, color: 'from-purple-500/10 to-indigo-500/10 text-purple-700' },
    { id: 'cat_housing', name: t.cat_housing, filter: 'Housing', count: 2, icon: Building2, color: 'from-amber-500/10 to-orange-500/10 text-amber-700' },
  ];

  const featuredSchemes = schemes.slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#14263D] via-[#1A324E] to-[#14263D] text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#1E385B]">
        {/* Decorative subtle background accents */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          {/* Innovation challenge pill */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs text-amber-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>{t.hero_badge}</span>
            <span className="text-white/60">• Problem Statement 9.1</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            {t.hero_title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {t.hero_description}
          </p>

          {/* Conversational Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mt-6">
            <div className="relative flex items-center bg-white rounded-2xl shadow-xl overflow-hidden p-1.5 border-2 border-teal-500/30 focus-within:border-teal-500 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.search_placeholder}
                className="w-full px-3 py-3 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#167D83] hover:bg-[#13666b] text-white px-5 py-3 rounded-xl font-semibold text-sm flex items-center space-x-2 transition-all shadow-md shrink-0 cursor-pointer"
              >
                <Bot className="w-4 h-4" />
                <span className="hidden sm:inline">{t.btn_ask_ai}</span>
              </button>
            </div>
          </form>

          {/* Quick CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-400/40 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>{t.btn_ask_ai}</span>
            </button>
            <button
              onClick={() => onNavigate('schemes')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t.btn_explore_schemes}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('eligibility')}
              className="px-5 py-2.5 rounded-xl bg-[#E3A64A]/20 hover:bg-[#E3A64A]/30 text-amber-300 border border-[#E3A64A]/40 text-xs font-semibold flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <span>{t.btn_check_eligibility}</span>
            </button>
          </div>
        </div>
      </section>

      {/* Trust & Key Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 text-center">
            <div className="text-3xl font-extrabold text-[#14263D] tracking-tight">10+</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{t.stat_schemes}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 text-center">
            <div className="text-3xl font-extrabold text-[#167D83] tracking-tight">100%</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{t.stat_accuracy}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 text-center">
            <div className="text-3xl font-extrabold text-[#E3A64A] tracking-tight">3</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{t.stat_languages}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-lg border border-slate-200/80 text-center">
            <div className="text-3xl font-extrabold text-emerald-600 tracking-tight">0</div>
            <div className="text-xs font-medium text-slate-500 mt-1">{t.stat_privacy}</div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {language === 'mr' ? 'योजना विभागानुसार शोधा' : language === 'hi' ? 'श्रेणी अनुसार योजनाएं खोजें' : 'Browse Schemes by Category'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'mr' ? 'आपल्या गरजेनुसार योग्य विभागाची निवड करा' : language === 'hi' ? 'अपनी आवश्यकतानुसार उपयुक्त श्रेणी का चयन करें' : 'Select a sector matching your profile and requirements'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => onNavigate('schemes', undefined, cat.filter)}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:shadow-md transition-all text-left flex items-start space-x-4 group cursor-pointer"
              >
                <div className={`p-3 rounded-xl bg-gradient-to-tr ${cat.color} shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm group-hover:text-[#167D83] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {language === 'mr' ? 'सत्यापित योजना पहा' : language === 'hi' ? 'सत्यापित योजनाएं देखें' : 'Verified government schemes'}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* How SAHAY AI Works (Workflow Architecture) */}
      <section className="bg-white py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold text-[#167D83] uppercase tracking-wider">
              Architecture & Transparency
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              {t.how_it_works_title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-2">
              {t.how_it_works_sub}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="bg-[#F7F8F5] p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#14263D] text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.step1_title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step1_desc}</p>
            </div>

            <div className="bg-[#F7F8F5] p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#167D83] text-white flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.step2_title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step2_desc}</p>
            </div>

            <div className="bg-[#F7F8F5] p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-[#E3A64A] text-slate-950 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.step3_title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step3_desc}</p>
            </div>

            <div className="bg-[#F7F8F5] p-6 rounded-2xl border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-sm">{t.step4_title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{t.step4_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Schemes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {t.featured_schemes}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr' ? 'नागरिकांमध्ये सर्वाधिक विचारल्या जाणाऱ्या योजना' : language === 'hi' ? 'नागरिकों द्वारा सर्वाधिक खोजी जाने वाली योजनाएं' : 'High impact welfare initiatives by Government of Maharashtra'}
            </p>
          </div>
          <button
            onClick={() => onNavigate('schemes')}
            className="text-xs font-semibold text-[#167D83] hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>{t.btn_explore_schemes}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuredSchemes.map((scheme) => {
            const schemeName = language === 'mr' ? scheme.name_mr : language === 'hi' ? scheme.name_hi : scheme.name_en;
            const schemeDesc = language === 'mr' ? scheme.description_mr : language === 'hi' ? scheme.description_hi : scheme.description_en;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#167D83] border border-teal-200">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Verified: {scheme.source_verified_date}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {schemeName}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {schemeDesc}
                  </p>

                  <div className="p-3 bg-amber-50/70 rounded-xl border border-amber-200/60 text-xs text-amber-900 font-medium">
                    <span className="font-semibold block text-[11px] text-amber-800">Benefit:</span>
                    {scheme.benefits_summary}
                  </div>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectScheme(scheme)}
                    className="text-xs font-semibold text-[#167D83] hover:underline cursor-pointer"
                  >
                    {t.view_details}
                  </button>
                  <a
                    href={scheme.official_portal_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                  >
                    <span>{t.apply_now}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

