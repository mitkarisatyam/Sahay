import React, { useState, useMemo, useEffect } from 'react';
import { Scheme, LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { Search, Filter, ExternalLink, Calendar, Building2, FileText, ArrowRight } from 'lucide-react';

interface SchemeExplorerProps {
  schemes: Scheme[];
  language: LanguageCode;
  initialCategory?: string;
  onSelectScheme: (scheme: Scheme) => void;
  onOpenChecklist: (schemeId: string) => void;
}

export const SchemeExplorer: React.FC<SchemeExplorerProps> = ({
  schemes,
  language,
  initialCategory,
  onSelectScheme,
  onOpenChecklist
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || 'All');
  const t = UI_TRANSLATIONS[language];

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const categories = [
    'All',
    'Agriculture',
    'Education',
    'Healthcare',
    'Women & Child Development',
    'Social Welfare',
    'Housing'
  ];

  const filteredSchemes = useMemo(() => {
    return schemes.filter((s) => {
      const matchCat =
        selectedCategory === 'All' ||
        s.category.toLowerCase().includes(selectedCategory.toLowerCase());

      const lowerSearch = search.toLowerCase().trim();
      const matchSearch =
        !lowerSearch ||
        s.name_en.toLowerCase().includes(lowerSearch) ||
        s.name_mr.toLowerCase().includes(lowerSearch) ||
        s.name_hi.toLowerCase().includes(lowerSearch) ||
        s.description_en.toLowerCase().includes(lowerSearch) ||
        s.department.toLowerCase().includes(lowerSearch) ||
        s.benefits_summary.toLowerCase().includes(lowerSearch) ||
        s.target_beneficiaries.toLowerCase().includes(lowerSearch);

      return matchCat && matchSearch;
    });
  }, [schemes, selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          {language === 'mr' ? 'शासकीय योजनांची सूची' : language === 'hi' ? 'सरकारी योजनाओं की सूची' : 'Maharashtra Government Scheme Explorer'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          {language === 'mr'
            ? 'पडताळणी केलेल्या अधिकृत योजना, पात्रता अटी, आर्थिक लाभ व आवश्यक कागदपत्रांची संपूर्ण माहिती येथे शोधा.'
            : language === 'hi'
            ? 'सत्यापित आधिकारिक योजनाएं, पात्रता शर्तें, आर्थिक लाभ एवं आवश्यक दस्तावेजों की पूरी जानकारी यहाँ देखें।'
            : 'Discover verified state welfare schemes with authentic eligibility criteria, benefits breakdown, required documents, and direct application links.'}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'mr'
                ? 'योजनेचे नाव किंवा विभाग शोधा...'
                : language === 'hi'
                ? 'योजना का नाम अथवा विभाग खोजें...'
                : 'Search by scheme name, benefit, department...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-[#F7F8F5] border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#167D83] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center text-xs text-slate-500 px-1">
        <span>Showing {filteredSchemes.length} verified schemes</span>
        {search && <span>Filtering by: "{search}"</span>}
      </div>

      {/* Schemes Grid */}
      {filteredSchemes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchemes.map((scheme) => {
            const schemeName = language === 'mr' ? scheme.name_mr : language === 'hi' ? scheme.name_hi : scheme.name_en;
            const schemeDesc = language === 'mr' ? scheme.description_mr : language === 'hi' ? scheme.description_hi : scheme.description_en;

            return (
              <div
                key={scheme.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-teal-50 text-[#167D83] border border-teal-200">
                      {scheme.category}
                    </span>
                    <span className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{scheme.source_verified_date}</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                    {schemeName}
                  </h3>

                  <p className="text-xs text-slate-500 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{scheme.department}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {schemeDesc}
                  </p>

                  {/* Benefit highlights box */}
                  <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-900 font-medium">
                    <span className="block text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                      Benefit:
                    </span>
                    <span className="line-clamp-2">{scheme.benefits_summary}</span>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectScheme(scheme)}
                      className="font-semibold text-[#167D83] hover:underline flex items-center space-x-1 cursor-pointer"
                    >
                      <span>{t.view_details}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onOpenChecklist(scheme.id)}
                      className="text-slate-500 hover:text-slate-800 font-medium flex items-center space-x-1 cursor-pointer"
                    >
                      <FileText className="w-3 h-3 text-teal-600" />
                      <span>Checklist</span>
                    </button>
                  </div>

                  <div className="pt-1">
                    <a
                      href={scheme.official_portal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] font-medium border border-slate-200 flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <span>Official Portal Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
          <p className="text-sm font-semibold text-slate-700">No schemes matched your criteria</p>
          <p className="text-xs text-slate-500">Try adjusting your keyword or category filter</p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
            }}
            className="text-xs font-semibold text-[#167D83] hover:underline mt-2 cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
