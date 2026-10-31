import React from 'react';
import { LanguageCode } from '../types';
import { UI_TRANSLATIONS } from '../i18n/translations';
import { ShieldCheck, ExternalLink, Heart, AlertCircle } from 'lucide-react';

interface FooterProps {
  language: LanguageCode;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <footer className="bg-[#0F1E30] text-slate-300 border-t border-[#1E385B] mt-16 text-sm">
      {/* Disclaimer warning bar */}
      <div className="bg-[#14263D] border-b border-[#1E385B] py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-start space-x-3 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-[#E3A64A] shrink-0 mt-0.5" />
          <p>{t.disclaimer_banner}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded bg-[#167D83] flex items-center justify-center font-bold text-white">
                स
              </div>
              <span className="font-bold text-lg text-white">{t.app_title}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {language === 'mr'
                ? 'महाराष्ट्र शासनाच्या योजनांची अधिकृत व खात्रीशीर माहिती नागरिकांपर्यंत त्यांच्या पसंतीच्या भाषेत पोहोचवणारे AI व्यासपीठ.'
                : language === 'hi'
                ? 'महाराष्ट्र सरकार की जनकल्याणकारी योजनाओं की सत्यापित जानकारी नागरिकों तक उनकी पसंदीदा भाषा में पहुँचाने वाला AI मंच।'
                : 'Empowering the citizens of Maharashtra with instant, source-grounded guidance on welfare schemes across health, education, and agriculture.'}
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>{t.stat_privacy}</span>
            </div>
          </div>

          {/* Column 2: Quick Features */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-teal-400">
              {language === 'mr' ? 'नागरिक सेवा' : language === 'hi' ? 'नागरिक सेवाएं' : 'Citizen Services'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('chat')} className="hover:text-teal-300">
                  {t.nav_chat}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schemes')} className="hover:text-teal-300">
                  {t.nav_schemes}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('eligibility')} className="hover:text-teal-300">
                  {t.nav_eligibility}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('checklist')} className="hover:text-teal-300">
                  {t.nav_checklist}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Official Maharashtra Portals */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-teal-400">
              {language === 'mr' ? 'अधिकृत शासकीय पोर्टल्स' : language === 'hi' ? 'आधिकारिक सरकारी पोर्टल्स' : 'Official Portals'}
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <a href="https://mahadbt.maharashtra.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-teal-300">
                  <span>MahaDBT Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://aaplesarkar.mahaonline.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-teal-300">
                  <span>Aaple Sarkar</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://ladakibahin.maharashtra.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-teal-300">
                  <span>Ladki Bahin Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a href="https://mjpjay.gov.in" target="_blank" rel="noreferrer" className="flex items-center space-x-1 hover:text-teal-300">
                  <span>MJPJAY Arogya Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Innovation Challenge */}
          <div className="space-y-2">
            <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-teal-400">
              Innovation Challenge
            </h4>
            <p className="text-xs text-slate-400">
              Seva First Innovation Challenge Maharashtra 2026
            </p>
            <p className="text-xs text-slate-400">
              Problem Statement 9.1: AI-Powered Citizen Services and Smart Governance
            </p>
            <div className="pt-2">
              <button 
                onClick={() => onNavigate('admin')}
                className="text-xs text-slate-400 hover:text-slate-200 underline"
              >
                {t.nav_admin}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#1E385B] flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400">
          <p>{t.footer_text}</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with care for public good</span>
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
          </p>
        </div>
      </div>
    </footer>
  );
};

